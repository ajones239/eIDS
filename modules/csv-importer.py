from modules import *
import numpy

class CSVImporter(InputParsingModule):

    def __init__(self):
        super(CSVImporter, self).__init__()
        self.stream = False
        self.dataFrequency = DataFrequency.ONE_TIME_ACCESS

    def getOutput(self):
        return self.output

    def addInput(self, data):
        self.output = numpy.array(data[0])

    def start(self, data):
        pass

    def stop(self, data):
        pass
