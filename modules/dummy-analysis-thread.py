from threading import Thread, Lock
from time import sleep
class DummyAnalysisThread(modules.Module, modules.IOModule):

    def __init__(self):
        super(DummyAnalysisThread, self).__init__()
        self.stream = False
        self.dataFrequency = modules.DataFrequency.ONE_TIME_ACCESS
        self.doneLock = Lock()
        self.done = False

    def getOutput(self):
        return 'some output'

    def addInput(self, moduleId, data):
        self.setHasOutput(True)
        print('DummyAnalysis receiving data')

    def start(self):
        self.thread = Thread(target=self.runAnalysis)
        self.thread.start()

    def stop(self):
        with self.doneLock:
            self.done = True
        self.thread.join()

    def runAnalysis(self):
        while True:
            with self.doneLock:
                if self.done:
                    break
            sleep(2)
            print("Analyzing Data....")

