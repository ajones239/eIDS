import uuid
from modules import verifyModuleJson
from configurationset import verifyConfigurationSetJson
import pymongo

dbclient = pymongo.MongoClient('mongodb://localhost:27017/')
moduleCollection = dbclient['eIDS']['modules']
configSetCollection = dbclient['eIDS']['configurations']

def addModule(moduleJson):
    moduleJson['id'] = moduleJson['_id'] = str(uuid.uuid4())
    verifyModuleJson(moduleJson)
    moduleCollection.insert_one(moduleJson)
    return moduleJson['id']

def addConfigurationSet(confJson):
    confJson['id'] = confJson['_id'] = str(uuid.uuid4())
    verifyConfigurationSetJson(confJson)
    configSetCollection.insert_one(confJson)

    return confJson['id']
