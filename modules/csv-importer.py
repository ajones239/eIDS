import numpy

class CSVImporter(modules.Module, modules.IOModule):

    def __init__(self):
        super(CSVImporter, self).__init__()
        self.stream = False
        self.dataFrequency = modules.DataFrequency.ONE_TIME_ACCESS

    def getOutput(self):
        return self._output

    def addInput(self, data):
        self._output = numpy.array(data[0])

    def start(self):
        pass

    def stop(self):
        pass

    def hasOutput(self):
        return self._output is not None
