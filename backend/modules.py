from enum import Enum
from abc import ABC, abstractmethod
from queue import Queue
from threading import RLock
import numpy as np


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


class Condition:

    def __init__(self):
        self.moduleId = None
        self.outputField = None
        self.comparison = None
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

        self._logLock = RLock()
        self._eventLock = RLock()
        self._logQueues = []
        self._eventQueues = []

    def getLogQueue(self):
        q = Queue()
        with self._logLock:
            self._logQueues.append(q)
        return q

    def _addLog(self, msg):
        with self._logLock:
            for q in self._loqQueues:
                q.put(msg)

    def getEventQueue(self):
        q = Queue()
        with self._eventLock:
            self._eventQueues.append(q)
        return q

    def _addEvent(self, event):
        with self._eventLock:
            for q in self._eventQueues:
                q.put(event)

    @abstractmethod
    def stop(self, data):
        pass

    @abstractmethod
    def start(self, data):
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
        self.associatedInputModules = None

        self.producesOutput = None
        self.outputRowCount = None
        self.outputFormat = None
        self.associatedOutputModules = None

        self._output = None
        self._outputLock = RLock()
        self._outputQueues = []

    def _addOutput(self, output):
        with self._outputLock:
            for q in self._outputQueues:
                q.put(output)

    def getOutputQueue(self):
        q = Queue()
        with self._outputLock:
            self._outputQueues.append(q)
        return q

    @abstractmethod
    def addInput(self, data):
        pass

    @abstractmethod
    def getOutput(self):
        pass


class ActionModule(ABC):

    def __init__(self):
        super(ActionModule, self).__init__()

    @abstractmethod
    def doAction(self):
        pass

    @abstractmethod
    def addCondition(self, cond):
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


