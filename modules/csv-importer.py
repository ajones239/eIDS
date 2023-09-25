import pandas
from base64 import urlsafe_b64decode

class CSVImporter(modules.Module, modules.IOModule):

    def __init__(self):
        super(CSVImporter, self).__init__()
        self.stream = False
        self.dataFrequency = modules.DataFrequency.ONE_TIME_ACCESS

    def getOutput(self):
        return self.getOutputData()

    def addInput(self, moduleId, data):
        self.addTempFile('csv-data', urlsafe_b64decode(data))
        print("adding input")
        self.setOutput(pandas.read_csv(self.getTempFilePath('csv-data')))

    def start(self):
        pass

    def stop(self):
        pass
