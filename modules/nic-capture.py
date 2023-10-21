import pyshark
from queue import Queue, Full, Empty
from threading import Thread, Lock

class NICCapture(modules.Module, modules.IOModule):

    def __init__(self):
        super(NICCapture, self).__init__()
        self.stream = False
        self.dataFrequency = modules.DataFrequency.CUSTOM
        self.dataFrequencyN = 5
        self.consumesInput = False
        self.producesOutput = True
        self.outputFormat = ['/path/to/file.pcap']
        self.outputRowCount = 1

        self.pcapQueue = Queue(maxsize=5)
        self.doneLock = Lock()
        self.fcount = 0
        self.done = False

    def getOutput(self):
        try:
            return self.pcapQueue.get()
        except Empty:
            return None

    def addInput(self, moduleId, data):
        pass

    def start(self):
        self.thread = Thread(target=self.captureNetworkTraffic)
        self.thread.start()

    def stop(self):
        with self.doneLock:
            self.done = True
        for i in range(self.fcount):
            self.deleteTempFile('f' + str(i) + '.pcap')
        self.thread.join()

    def captureNetworkTraffic(self):
        while True:
            with self.doneLock:
                if self.done:
                    break
            outfile = self.getTempFilePath('f' + str(self.fcount) + '.pcap')
            cap = pyshark.LiveCapture(interface='any', output_file=outfile)
            cap.sniff(self.dataFrequencyN)
            cap.close()
            try:
                self.pcapQueue.put(outfile, block=True, timeout=self.dataFrequencyN)
            except Full:
                continue
            self.fcount += 1


