from modules import *
from configurationset import *

from threading import RLock
from bson.objectid import ObjectId
from pymongo import MongoClient
import base64

dbclient = MongoClient('mongodb://localhost:27017/')
moduleCollection = dbclient['eIDS']['modules']
configSetCollection = dbclient['eIDS']['configurations']

modules = dict()
configurationSets = dict()
moduleLock = RLock()
configSetLock = RLock()


def addModule(moduleJson):
    verifyModuleJson(moduleJson)
    return str(moduleCollection.insert_one(moduleJson).inserted_id)


def getModuleJson(id):
    mjson = moduleCollection.find_one({'_id': ObjectId(id)})
    if mjson is None:
        raise ModuleNotFoundError('Invalid module ID ' + id)
    mjson['id'] = id
    mjson.pop('_id')
    return mjson


def loadModule(id):
    mjson = getModuleJson(id)
    impl = base64.urlsafe_b64decode(mjson['implementation'])
    exec(impl, globals())
    globals()[mjson['name']].__module__ = 'modules'
    module = globals()[mjson['name']]()
    with moduleLock:
        modules[id] = module
    try:
        module.data = mjson['data']
    except KeyError:
        pass
    return module


def getModule(id):
    try:
        with moduleLock:
            return modules[id]
    except KeyError:
        return loadModule(id)


def addConfigurationSet(confJson):
    id = str(configSetCollection.insert_one(confJson).inserted_id)
    confSet = ConfigurationSet(confJson)
    confSet.id = id
    with configSetLock:
        configurationSets[confSet.id] = confSet
    return str(confSet.id)


def getConfigurationSetJson(id):
    configjson = configSetCollection.find_one({'_id': ObjectId(id)})
    if configjson is None:
        raise ConfigurationSetException('Invalid configuration set ID ' + id)
    configjson[id] = id
    configjson.pop('_id')
    return configjson


def loadConfigurationSet(id):
    configjson = getConfigurationSetJson(id)
    configSet = ConfigurationSet(configjson)
    with configSetLock:
        configurationSets[id] = configSet
    return configSet


def getConfigurationSet(id):
    try:
        with configSetLock:
            return configurationSets[id]
    except KeyError:
        return loadConfigurationSet(id)


def startConfigurationSet(id):
    configSet = getConfigurationSet(id)
    configSet.active = True
    # sort by level
    configSet.modules.sort(key=lambda t: t[1])
    notLoaded = []
    loaded = []

    # find which modules are already loaded
    with moduleLock:
        for m in configSet.modules:
            try:
                loaded.append(modules[m['id']]['id'])
            except KeyError:
                notLoaded.append(m['id'])

    for id in notLoaded:
        module = loadModule(id)
        with moduleLock:
            modules[id] = module
        loaded.append(id)

    for id in loaded:
        pass

