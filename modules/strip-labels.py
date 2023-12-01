class LabelStripper(modules.Module, modules.IOModule):

    def __init__(self):
        super(LabelStripper, self).__init__()
        self.stream = False
        self.dataFrequency = modules.DataFrequency.ONE_TIME_ACCESS

    def getOutput(self):
        return self.getOutputData()

    def addInput(self, moduleId, data):
        # the data I have has a space in label column name, but not sure if it always will
        try:
            data = data.drop(' Label', axis=1)
        except KeyError:
            pass
        try:
            data = data.drop('Label', axis=1)
        except KeyError:
            pass
        self.setOutput(data)
        print('Got data: ', data)

    def start(self):
        self.log('Starting Label Stripper Module')
        pass

    def stop(self):
        pass
