from abc import ABC, abstractmethod
import queue
import threading

class Module(ABC):

    def __init__(self):
        super().__init__()

        self.id = None
        self.name = None
        self.description = None
        self.type = None
        self.implementation = None

        self._logLock = threading.Lock()
        self._eventLock = threading.Lock()
        self._logQueues = []
        self._eventQueues = []

    def getLogQueue(self):
        q = queue.Queue()
        with self._logLock:
            self._logQueues.append(q)
        return q

    def _addLog(self, msg):
        with self._logLock:
            for q in self._loqQueues:
                q.put(msg)

    def getEventQueue(self):
        q = queue.Queue()
        with self._eventLock:
            self._eventQueues.append(q)
        return q

    def _addEvent(self, event):
        with self._eventLock:
            for q in self._eventQueues:
                q.put(event)


class ModuleIO(ABC):

    def __init__(self):
        super().__init__()

        self.stream = None
        self.dataFrequency = None
        self.outputRowCount = None
        self.outputFormat = None
        self.inputRowCount = None
        self.inputFormat = None
        self.associatedInputModules = None
        self.associatedOutputModules = None

        self._data = None
        self._dataLock = threading.Lock()
        self._dataQueues = []

    def _addData(self, data):
        with self._dataLock:
            for q in self._dataQueues:
                q.put(data)

    def getDataQueue(self):
        q = queue.Queue()
        with self._dataLock:
            self._dataQueues.append(q)
        return q

    @abstractmethod
    def getData(self):
        pass

