class DummyAnalysis(modules.Module, modules.IOModule):

    def __init__(self):
        super(DummyAnalysis, self).__init__()
        self.stream = False
        self.dataFrequency = modules.DataFrequency.ONE_TIME_ACCESS

    def getOutput(self):
        return 'some output'

    def addInput(self, data):
        print('DummyAnalysis receiving data')
        pass

    def start(self):
        pass

    def stop(self):
        pass

    def hasOutput(self):
        return self._output is not None
