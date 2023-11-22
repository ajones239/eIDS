from threading import Thread, Lock
from pymongo import MongoClient
import datetime
from time import sleep
class DataGrapher(modules.Module, modules.IOModule):

    def __init__(self):
        super(DataGrapher, self).__init__()
        self.dbclient = None
        self.stream = False
        self.dataFrequency = modules.DataFrequency.ONE_TIME_ACCESS
        self.doneLock = Lock()
        self.done = False
        self.db = None

    def getOutput(self):
        return 'some output'

    def addInput(self, moduleId, data):
        self.setHasOutput(True)
        print('DummyAnalysis receiving data')

    def start(self):
        self.thread = Thread(target=self.runAnalysis)
        self.thread.start()

    def stop(self):
        with self.doneLock:
            self.done = True
        self.thread.join()

    def runAnalysis(self):
        self.dbclient = MongoClient('mongodb://localhost:27017/')
        self.db = self.dbclient['eIDS']['graphdata']
        while True:
            with self.doneLock:
                if self.done:
                    break
            sleep(4)
            print("Updating Data....")
            self.db.update_one({'g_id':"graph_id2",'x_value': datetime.datetime(2023, 11, 21, 0, 0)},{"$inc":{"y_value":1}},upsert=True)
