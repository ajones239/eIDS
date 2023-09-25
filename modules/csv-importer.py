import numpy
from base64 import urlsafe_b64decode

class CSVImporter(modules.Module, modules.IOModule):

    def __init__(self):
        super(CSVImporter, self).__init__()
        self.stream = False
        self.dataFrequency = modules.DataFrequency.ONE_TIME_ACCESS

    def getOutput(self):
        return self.getOutputData()

    def addInput(self, moduleId, data):
        self.setOutput(numpy.array(urlsafe_b64decode(data)))
        self.setHasOutput(True)

    def start(self):
        pass

    def stop(self):
        pass
