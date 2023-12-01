import controlplane

from enum import Enum
from abc import ABC, abstractmethod
from queue import Queue
from threading import RLock
import os
import tempfile
import datetime


class ModuleException(Exception):

    def __init__(self, message):
        self.message = message


class ModuleType(Enum):
    INPUT_PARSING = 1
    PROCESSING = 2
    ANALYSIS = 3
    ACTION = 4


class DataFrequency(Enum):
    ONE_TIME_ACCESS = 1
    CONTINUOUS = 2
    CUSTOM = 3


class IOFormat:

    def __init__(self):
        self.index = None
        self.label = None


class Resource:

    def __init__(self):
        self.name = None
        self.data = None


class Module(ABC):

    def __init__(self):
        super(Module, self).__init__()

        self.id = None
        self.name = None
        self.description = None
        self.type = None
        self.implementation = None
        self.data = None

        self._logdump = ""
        self._logLock = RLock()
        self._eventLock = RLock()
        self._logQueues = []
        self._eventQueues = []

    def getLogQueue(self):
        q = Queue()
        with self._logLock:
            self._logQueues.append(q)
        return q

    def log(self, msg):
        with self._logLock:
            self._logdump += str(datetime.datetime.now()) + ' | module ' + str(self.id) + ' | ' + msg + '\n'

    def getLogs(self):
        with self._logLock:
            return self._logdump

    def _addLog(self, msg):
        with self._logLock:
            for q in self._loqQueues:
                q.put(msg)

    def getEventQueue(self):
        q = Queue()
        with self._eventLock:
            self._eventQueues.append(q)
        return q

    def addTempFile(self, name, data):
        path = os.path.join(tempfile.gettempdir(), 'eIDS', self.id)
        if not os.path.isdir(path):
            os.makedirs(path)
        with open(os.path.join(path, name), 'wb') as f:
            f.write(data)

    def getTempFile(self, name):
        path = os.path.join(tempfile.gettempdir(), 'eIDS', self.id, name)
        if not os.path.isfile(path):
            return None
        with open(path, 'rb') as f:
            return f.read()

    def getTempFilePath(self, name):
        return os.path.join(tempfile.gettempdir(), 'eIDS', self.id, name)

    def getTempDir(self):
        path = os.path.join(tempfile.gettempdir(), 'eIDS', self.id)
        if not os.path.isdir(path):
            os.makedirs(path)
        return path

    def deleteTempFile(self, name):
        os.remove(os.path.join(tempfile.gettempdir(), 'eIDS', self.id, name))

    def _addEvent(self, event):
        with self._eventLock:
            for q in self._eventQueues:
                q.put(event)

    @abstractmethod
    def stop(self):
        pass

    @abstractmethod
    def start(self):
        pass


class IOModule(ABC):

    def __init__(self):
        super(IOModule, self).__init__()

        self.stream = None
        self.dataFrequency = None
        self.dataFrequencyN = None

        self.consumesInput = None
        self.inputRowCount = None
        self.inputFormat = None
        self.associatedInputModules = []

        self.producesOutput = None
        self.outputRowCount = None
        self.outputFormat = None
        self.associatedOutputModules = []

        self._output = None
        self._outputLock = RLock()
        self._outputQueues = []
        self._hasOutput = False

        self._associationLock = RLock()

    def _addOutput(self, output):
        with self._outputLock:
            for q in self._outputQueues:
                q.put(output)

    def associateInputModule(self, moduleId):
        with self._associationLock:
            self.associatedInputModules.append(moduleId)

    def associateOutputModule(self, moduleId):
        with self._associationLock:
            self.associatedOutputModules.append(moduleId)

    def disassociateInputModule(self, moduleId):
        with self._associationLock:
            self.associatedInputModules.remove(moduleId)

    def disassociateOutputModule(self, moduleId):
        with self._associationLock:
            self.associatedOutputModules.remove(moduleId)

    def getOutputQueue(self):
        q = Queue()
        with self._outputLock:
            self._outputQueues.append(q)
        return q

    def setOutput(self, data):
        if self.stream:
            self._addOutput(data)
        else:
            with self._outputLock:
                self._output = data
                self._hasOutput = True

    def getOutputData(self):
        with self._outputLock:
            r = self._output
            self._hasOutput = False
            self._output = None
            return r

    def setHasOutput(self, flag):
        with self._outputLock:
            self._hasOutput = flag

    def hasOutput(self):
        with self._outputLock:
            return self._hasOutput

    def findModule(self, moduleId):
        return controlplane.getModule(moduleId)

    @abstractmethod
    def addInput(self, moduleId, data):
        pass

    @abstractmethod
    def getOutput(self):
        pass


class ActionModule(IOModule):

    def __init__(self):
        super(ActionModule, self).__init__()

        self.conditions = []

        self.operators = {
            '=': lambda data, value: data == value,
            '!=': lambda data, value: data != value,
            'contains': lambda data, value: value in data
        }

    def addCondition(self, cond):
        # ignore invalid operators
        if cond['operator'] not in self.operators.keys():
            return 
        self.conditions.append(cond)

    def addInput(self, moduleId, data):
        for cond in self.conditions:
            if self.operators[cond['operator']](str(data), cond['value']):
                self.doAction(data)

    def getOutput(self):
        pass

    @abstractmethod
    def doAction(self, data):
        pass


def verifyModuleJson(m):
    check_keys = {"name", "description", "type", "dependencies", "implementation"}
    for i in check_keys:
        if i not in m.keys():
            raise ModuleException("Missing field '" + i + "'")
    try:
        ModuleType(m['type'])
    except ValueError:
        raise ModuleException("Invalid type")


