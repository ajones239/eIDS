from threading import Thread, Lock
from pymongo import MongoClient
import datetime
import random


dbclient = MongoClient('mongodb://localhost:27017/')
db = dbclient['eIDS']['graphdata']

for _ in range(100):
    classes = {
        0: "Bot",
        1: "BruteForce",
        2: "DoS",
        3: "Infiltration",
        4: "PortScan",
        5: "WebAttack"
    }
    days = random.uniform(20,28)
    t = datetime.datetime.utcnow()
    tn = datetime.datetime(t.year, t.month - 1, t.day + int(days), 0, 0)
    r = random.uniform(0, 6)
    l = classes[int(r)]
    db.insert_one({'g_id':"graph_id2",'x_value':  tn,'y_value': l})
