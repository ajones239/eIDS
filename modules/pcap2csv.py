from queue import Queue, Empty, Full
from sys import platform
from threading import Thread
import pandas
import urllib.request
import os
import zipfile
import shutil
import subprocess

class Pcap2Csv(modules.Module, modules.IOModule):

    def __init__(self):
        super(Pcap2Csv, self).__init__()
        self.stream = False
        self.dataFrequency = modules.DataFrequency.CUSTOM
        self.dataFrequencyN = 10
        self.consumesInput = True
        self.inputRowFormat = '/path/to/file.pcap'
        self.producesOutput = True
        self.outputFormat = ['Destination Port', 'Flow Duration', 'Total Fwd Packets', 'Total Backward Packets','Total Length of Fwd Packets', 'Total Length of Bwd Packets', 'Fwd Packet Length Max', 'Fwd Packet Length Min', 'Fwd Packet Length Mean', 'Fwd Packet Length Std','Bwd Packet Length Max', 'Bwd Packet Length Min', 'Bwd Packet Length Mean', 'Bwd Packet Length Std','Flow Bytes/s', 'Flow Packets/s', 'Flow IAT Mean', 'Flow IAT Std', 'Flow IAT Max', 'Flow IAT Min','Fwd IAT Total', 'Fwd IAT Mean', 'Fwd IAT Std', 'Fwd IAT Max', 'Fwd IAT Min','Bwd IAT Total', 'Bwd IAT Mean', 'Bwd IAT Std', 'Bwd IAT Max', 'Bwd IAT Min','Fwd PSH Flags', 'Bwd PSH Flags', 'Fwd URG Flags', 'Bwd URG Flags', 'Fwd Header Length', 'Bwd Header Length','Fwd Packets/s', 'Bwd Packets/s', 'Min Packet Length', 'Max Packet Length', 'Packet Length Mean', 'Packet Length Std', 'Packet Length Variance','FIN Flag Count', 'SYN Flag Count', 'RST Flag Count', 'PSH Flag Count', 'ACK Flag Count', 'URG Flag Count', 'CWE Flag Count', 'ECE Flag Count', 'Down/Up Ratio', 'Average Packet Size', 'Avg Fwd Segment Size', 'Avg Bwd Segment Size', 'Fwd Header Length','Fwd Avg Bytes/Bulk', 'Fwd Avg Packets/Bulk', 'Fwd Avg Bulk Rate', 'Bwd Avg Bytes/Bulk', 'Bwd Avg Packets/Bulk','Bwd Avg Bulk Rate','Subflow Fwd Packets', 'Subflow Fwd Bytes', 'Subflow Bwd Packets', 'Subflow Bwd Bytes','Init_Win_bytes_forward', 'Init_Win_bytes_backward', 'act_data_pkt_fwd', 'min_seg_size_forward','Active Mean', 'Active Std', 'Active Max', 'Active Min','Idle Mean', 'Idle Std', 'Idle Max', 'Idle Min', 'Label']
        self.outputRowCount = -1

        self.outQueue = Queue(maxsize=5)
        self.inQueue = Queue(maxsize=5)
        self.doneLock = Lock()
        self.done = False

    def getOutput(self):
        try:
            return self.outQueue.get_nowait()
        except Empty:
            return None

    def addInput(self, moduleId, data):
        try:
            self.inQueue.put(data, block=False)
        except Full:
            pass

    def start(self):
        self.addTempFile('none', b'0')
        urllib.request.urlretrieve(self.data['cicflowmeter_url'], self.getTempFilePath('cicflowmeter.zip'))
        with zipfile.ZipFile(self.getTempFilePath('cicflowmeter.zip'), 'r') as z:
            z.extractall(self.getTempDir())
        self.thread = Thread(target=self.processPcaps)
        self.thread.start()

    def stop(self):
        with self.doneLock:
            self.done = True
        for i in range(self.fcount):
            self.deleteTempFile('f' + str(i) + '.pcap')
        self.thread.join()

    def processPcaps(self):
        while True:
            with self.doneLock:
                if self.done:
                    break
            try:
                pcap = self.inQueue.get_nowait()
                if pcap is None:
                    continue
            except Empty:
                continue
            shutil.move(pcap, os.path.join(self.getTempDir(), 'in', 'f.pcap'))
            cmd = 'CICFlowMeter'
            if platform.lower() == 'windows':
                cmd += '.bat'
            else:
                os.chmod(os.path.join(self.getTempDir(), 'bin', cmd), 0o755)
            cmds = [
                os.path.join(self.getTempDir(), 'bin', cmd),
                os.path.join(self.getTempDir(), 'in', 'f.pcap'),
                os.path.join(self.getTempDir(), 'out')
            ]
            subprocess.run(cmds)
            os.remove(os.path.join(self.getTempDir(), 'in', 'f.pcap'))
            data = pandas.read_csv(os.path.join(self.getTempDir(), 'out', 'f_ISCX.csv'), skiprows=3)
            # data = data.rename(columns=data.iloc[0]).drop(data.index[0])
            print(data)
            os.remove(os.path.join(self.getTempDir(), 'out', 'f_ISCX.csv'))
            try:
                self.outQueue.put(self.processDataframe(data), block=False)
            except Full:
                continue

            if self.outQueue.qsize() > 1:
                self.setHasOutput(True)
            else:
                self.setHasOutput(False)

    def processDataframe(self, df):
        cols_to_drop = ['Flow ID', 'Src IP', 'Dst Port', 'Src Port', 'Dst IP', 'Dst Port', 'Protocol', 'Timestamp', 'Label']
        cols_to_rename = {
            # 'Dst Port': 'Destination Port',
            'Total Fwd Packet': 'Total Fwd Packets',
            'Total Bwd packets': 'Total Backward Packets',
            'Total Length of Fwd Packet': 'Total Length of Fwd Packets',
            'Total Length of Bwd Packet': 'Total Length of Bwd Packets',
            'Packet Length Min': 'Min Packet Length',
            'Packet Length Max': 'Max Packet Length',
            'CWR Flag Count': 'CWE Flag Count',
            'Fwd Segment Size Avg': 'Avg Fwd Segment Size',
            'Bwd Segment Size Avg': 'Avg Bwd Segment Size',
            'Fwd Bytes/Bulk Avg': 'Fwd Avg Bytes/Bulk',
            'Fwd Packet/Bulk Avg': 'Fwd Avg Packets/Bulk',
            'Fwd Bulk Rate Avg': 'Fwd Avg Bulk Rate',
            'Bwd Bytes/Bulk Avg': 'Bwd Avg Bytes/Bulk',
            'Bwd Packet/Bulk Avg': 'Bwd Avg Packets/Bulk',
            'Bwd Bulk Rate Avg': 'Bwd Avg Bulk Rate',
            'FWD Init Win Bytes': 'Init_Win_bytes_forward',
            'Bwd Init Win Bytes': 'Init_Win_bytes_backward',
            'Fwd Act Data Pkts': 'act_data_pkt_fwd',
            'Fwd Seg Size Min': 'min_seg_size_forward'
        }
        df.drop(columns=cols_to_drop, inplace=True)
        df.rename(columns=cols_to_rename, inplace=True)
        df.insert(54, 'Fwd Header Length.1', df['Fwd Header Length'])
        return df
