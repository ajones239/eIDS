class DummyProcessing(modules.Module, modules.IOModule):

    def __init__(self):
        super(DummyProcessing, self).__init__()
        self.stream = False
        self.dataFrequency = modules.DataFrequency.ONE_TIME_ACCESS

    def getOutput(self):
        return self.getOutputData()

    def addInput(self, moduleId, data):
        self.setOutput(data)
        print(type(data))
        print('Got data: ', data)

    def start(self):
        self.log('Starting Dummy Processing Module')
        pass

    def stop(self):
        pass
