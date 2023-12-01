import pyshark
import os
from queue import Queue, Full, Empty
from threading import Thread, Lock
import time

class NICCapture(modules.Module, modules.IOModule):

    def __init__(self):
        super(NICCapture, self).__init__()
        self.stream = False
        self.dataFrequency = modules.DataFrequency.CUSTOM
        self.dataFrequencyN = 10
        self.consumesInput = False
        self.producesOutput = True
        self.outputFormat = '/path/to/file.pcap'
        self.outputRowCount = 1

        self.pcapQueue = Queue(maxsize=5)
        self.doneLock = Lock()
        self.fcount = 0
        self.done = False

    def getOutput(self):
        try:
            self.log('Returning path to PCAP file')
            return self.pcapQueue.get()
        except Empty:
            return None

    def addInput(self, moduleId, data):
        pass

    def start(self):
        self.addTempFile('none', b'0')
        self.thread = Thread(target=self.captureNetworkTraffic)
        self.thread.start()
        self.log('Starting NIC Capture Module')

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
            interface = 'wlp6s0'
            self.log('Capturing network on NIC ' + interface)

            outfile = self.getTempFilePath('f' + str(self.fcount) + '.pcap')
            cap = pyshark.LiveCapture(interface=interface, output_file=outfile)
            cap.sniff(timeout=self.dataFrequencyN)
            cap.close()
            try:
                self.log('Saving data as PCAP file.')
                self.pcapQueue.put(outfile, block=True, timeout=self.dataFrequencyN)
            except Full:
                self.log('Queue full, skipping timeblock')
                time.sleep(self.dataFrequencyN)
                continue
            self.fcount += 1
            if self.pcapQueue.qsize() > 1:
                self.setHasOutput(True)
            else:
                self.setHasOutput(False)

