import numpy

class CSVImporter(modules.Module, modules.IOModule):

    def __init__(self):
        super(CSVImporter, self).__init__()
        self.stream = False
        self.dataFrequency = modules.DataFrequency.ONE_TIME_ACCESS

    def getOutput(self):
        return self.output

    def addInput(self, data):
        self.output = numpy.array(data[0])

    def start(self):
        pass

    def stop(self):
        pass
