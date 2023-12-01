from threading import Thread, Lock
from pymongo import MongoClient
import datetime
import random

class DataGrapher(modules.Module, modules.IOModule):

    def __init__(self):
        super(DataGrapher, self).__init__()
        self.dbclient = None
        self.db = None
        self.log('Starting DataGrapher Module')

    def getOutput(self):
        return self.getOutputData()

    def addInput(self, moduleId, data):
        classes = {
            0: "Bot",
            1: "BruteForce",
            2: "DoS",
            3: "Infiltration",
            4: "PortScan",
            5: "WebAttack"
        }
        r = random.uniform(0, 6)
        l = classes[int(r)]
        self.setOutput(l)
        self.db.insert_one({'g_id':"graph_id2",'x_value': datetime.datetime.utcnow(),'y_value': l})

    def start(self):
        self.dbclient = MongoClient('mongodb://localhost:27017/')
        self.db = self.dbclient['eIDS']['graphdata']

    def stop(self):
        pass

