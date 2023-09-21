class DummyProcessing(modules.Module, modules.IOModule):

    def __init__(self):
        super(DummyProcessing, self).__init__()
        self.stream = False
        self.dataFrequency = modules.DataFrequency.ONE_TIME_ACCESS

    def getOutput(self):
        return self._output

    def addInput(self, data):
        self._output = data
        print('Number of columns in numpy array: ', len(data))

    def start(self):
        pass

    def stop(self):
        pass

    def hasOutput(self):
        return self._output is not None
