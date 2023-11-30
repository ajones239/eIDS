class DummyAnalysis(modules.Module, modules.IOModule):

    def __init__(self):
        super(DummyAnalysis, self).__init__()
        self.stream = False
        self.dataFrequency = modules.DataFrequency.ONE_TIME_ACCESS

    def getOutput(self):
        return 'some output'

    def addInput(self, moduleId, data):
        self.setHasOutput(True)
        print('DummyAnalysis receiving data')
        pass

    def start(self):
        self.log('Starting Dummy Analysis Module')
        pass

    def stop(self):
        pass

