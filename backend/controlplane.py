from modules import verifyModuleJson
from configurationset import ConfigurationSet, ConfigurationSetException
from threading import RLock
from bson.objectid import ObjectId
import pymongo

dbclient = pymongo.MongoClient('mongodb://localhost:27017/')
moduleCollection = dbclient['eIDS']['modules']
configSetCollection = dbclient['eIDS']['configurations']

modules = dict()
configurationSets = dict()
moduleLock = RLock()
configSetLock = RLock()

def addModule(moduleJson):
    verifyModuleJson(moduleJson)
    return str(moduleCollection.insert_one(moduleJson).inserted_id)

def addConfigurationSet(confJson):
    id = configSetCollection.insert_one(confJson).inserted_id
    confSet = ConfigurationSet(confJson)
    confSet.id = id
    with configSetLock:
        configurationSets[confSet.id] = confSet
    return str(confSet.id)

def startConfigurationSet(id):
    try:
        with configSetLock:
            configSet = configurationSets[id]
            configurationSets[id].active = True
    except KeyError:
        configSet = ConfigurationSet(configSetCollection.find_one({'_id': ObjectId(id)}))
        if configSet is None:
            raise ConfigurationSetException("Invalid configuration set ID")
        configSet.active = True
        with configSetLock:
            configurationSets[id] = configSet
    with configSetLock:
        configSet.modules.sort(key=lambda t: t[1])
#    for module in configSet.modules:
        


