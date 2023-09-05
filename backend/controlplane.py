import uuid
from modules import verifyModuleJson
import pymongo

dbclient = pymongo.MongoClient('mongodb://localhost:27017/')
moduleCollection = dbclient['eIDS']['modules']

def addModule(moduleJson):
    moduleJson['id'] = moduleJson['_id'] = str(uuid.uuid4())
    verifyModuleJson(moduleJson)
    dbres = moduleCollection.insert_one(moduleJson)
    return dbres.inserted_id
