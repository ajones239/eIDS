class DummyProcessing(modules.Module, modules.IOModule):

    def __init__(self):
        super(DummyProcessing, self).__init__()
        self.stream = False
        self.dataFrequency = modules.DataFrequency.ONE_TIME_ACCESS

    def getOutput(self):
        return self.getOutputData()

    def addInput(self, data):
        self.setOutput(data)
        self.setHasOutput(True)
        print('Number of columns in numpy array: ', len(data))

    def start(self):
        pass

    def stop(self):
        pass
