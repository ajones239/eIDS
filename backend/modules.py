from enum import Enum
from abc import ABC, abstractmethod
from queue import Queue
from threading import Lock
import numpy as np


class ModuleType(Enum):
    INPUT_PARSING = 1
    PROCESSING = 2
    ANALYSIS = 3
    ACTION = 4


class DataFrequency(Enum):
    ONE_TIME_ACCESS = 1
    CONTINUOUS = 2
    CUSTOM = 3


class Module(ABC):

    def __init__(self):
        super(Module, self).__init__()

        self.id = None
        self.name = None
        self.description = None
        self.type = None
        self.implementation = None

        self._logLock = Lock()
        self._eventLock = Lock()
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


class ModuleIO(ABC):

    def __init__(self):
        super(ModuleIO, self).__init__()

        self.stream = None
        self.dataFrequency = None
        self.outputRowCount = None
        self.outputFormat = None
        self.inputRowCount = None
        self.inputFormat = None
        self.associatedInputModules = None
        self.associatedOutputModules = None

        self._output = None
        self._outputLock = Lock()
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


class CSVImporter(Module, ModuleIO):

    def __init__(self):
        super(CSVImporter, self).__init__()
        self.id = None
        self.name = 'CSV Importer'
        self.description = 'A generic input parsing module for parsing CSV files. This module converts the data argument of addInput to a numpy array, assuming all values are data.'
        self.type = ModuleType.INPUT_PARSING
        self.implementation = None
        self.stream = False
        self.dataFrequency = DataFrequency.ONE_TIME_ACCESS

    def getOutput(self):
        return self.output

    def addInput(self, data):
        self.output = np.array(data[0])

