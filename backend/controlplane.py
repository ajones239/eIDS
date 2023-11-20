import modules
import configurationset
import worker

from threading import RLock
from bson.objectid import ObjectId
from pymongo import MongoClient
from base64 import urlsafe_b64decode
import importlib.util
import subprocess
import sys


dbclient = MongoClient('mongodb://localhost:27017/')
moduleCollection = dbclient['eIDS']['modules']
configSetCollection = dbclient['eIDS']['configurations']

activeModules = dict()
activeConfigurationSets = dict()
activeWorkers = dict()

moduleLock = RLock()
configSetLock = RLock()
workerLock = RLock()


def addModule(moduleJson):
    modules.verifyModuleJson(moduleJson)
    for dep in moduleJson['dependencies']:
        if importlib.util.find_spec(dep) is None:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', dep])
    return str(moduleCollection.insert_one(moduleJson).inserted_id)


def getModuleJson(id):
    mjson = moduleCollection.find_one({'_id': ObjectId(id)})
    if mjson is None:
        raise modules.ModuleException('Invalid module ID ' + id)
    mjson['id'] = id
    mjson.pop('_id')
    return mjson


def loadModule(id):
    mjson = getModuleJson(id)
    impl = urlsafe_b64decode(mjson['implementation'])
    exec(impl, globals())
    globals()[mjson['name']].__module__ = 'modules'
    module = globals()[mjson['name']]()
    module.id = mjson['id']
    with moduleLock:
        activeModules[id] = module
    try:
        module.name = mjson['name']
        module.data = mjson['data']
    except KeyError:
        pass
    return module


def getModuleWithException(id):
    try:
        with moduleLock:
            return activeModules[id]
    except KeyError:
        raise modules.ModuleException('No module loaded with ID: ' + id)


def getModule(id):
    try:
        with moduleLock:
            return activeModules[id]
    except KeyError:
        return loadModule(id)


def getAllModulesJson():
    cursor = moduleCollection.find({})
    results = []
    for document in cursor:
        document['id'] = str(document["_id"])
        document.pop('_id')
        results.append(document)
    return results


def updateModule(id,moduleJson):
    if not moduleCollection.find_one({"_id":ObjectId(id)}):
        raise modules.ModuleException('No module loaded with ID: ' + id)
    #verify Json
    modules.verifyModuleJson(moduleJson)
    #get list of active config sets that we need to restart
    runningConfigSets = []
    with configSetLock:
        for c in activeConfigurationSets:
            if any ( d['id'] == id for d in activeConfigurationSets[c].modules) and activeConfigurationSets[c].active == True:
                runningConfigSets.append(c)

    #stop module
    stopModule(id)
    #unload module
    unloadModule(id)
    #update module
    for dep in moduleJson['dependencies']:
        if importlib.util.find_spec(dep) is None:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', dep])
    moduleCollection.update_one({"_id":ObjectId(id)},{"$set": moduleJson})
    #reload module
    loadModule(id)
    #restart configSets

    for c in runningConfigSets:
        print(c)
        startConfigurationSet(c)

    return True
    

def deleteModule(id):
    stopModule(id)
    unloadModule(id)
    moduleCollection.delete_one({"_id":ObjectId(id)})

    return True


#removes module object from memory
def unloadModule(id):
    with moduleLock:
        try:
            m = activeModules.pop(id)
            del globals()[m.name]
            del m
        except KeyError:
            pass



#stop module workers and config sets
def stopModule(id):
    #check configuration sets first and stop workers
    with configSetLock:
        for c in activeConfigurationSets:
            if id in activeConfigurationSets[c].modules:
                stopConfigurationSet(activeConfigurationSets[c].id)
    
    #redundant stop for rogue workers
    stopWorker(id)



def addConfigurationSet(confJson):
    id = str(configSetCollection.insert_one(confJson).inserted_id)
    confSet = configurationset.ConfigurationSet(confJson)
    confSet.id = id
    with configSetLock:
        activeConfigurationSets[confSet.id] = confSet
    return str(confSet.id)


def getConfigurationSetJson(id):
    configjson = configSetCollection.find_one({'_id': ObjectId(id)})
    if configjson is None:
        raise configurationset.ConfigurationSetException('Invalid configuration set ID ' + id)
    configjson[id] = id
    configjson.pop('_id')
    return configjson


def loadConfigurationSet(id):
    configjson = getConfigurationSetJson(id)
    configSet = configurationset.ConfigurationSet(configjson)
    with configSetLock:
        activeConfigurationSets[id] = configSet
    return configSet


def getConfigurationSet(id):
    try:
        with configSetLock:
            return activeConfigurationSets[id]
    except KeyError:
        return loadConfigurationSet(id)


def getAllConfigurationSetsJson():
    cursor = configSetCollection.find({})
    results = []
    for document in cursor:
        document['id'] = str(document["_id"])
        document.pop('_id')
        results.append(document)
    return results

def getAllActiveConfigurationSetsJson():
    data = []
    with configSetLock:
        try:
            for id,c in activeConfigurationSets.items():
                if c.active:
                    data.append({'id':id,'name': c.name,'description': c.description,'modules':c.modules,'connections':c.connections})
        except KeyError:
            pass
    return data

def updateConfigurationSet(id,configJson):
    isActive = getConfigurationSet(id).active
    stopConfigurationSet(id)
    unloadConfigurationSet(id)
    print("Got to here")
    configSetCollection.update_one({"_id":ObjectId(id)},{"$set": configJson})
    loadConfigurationSet(id)

    if isActive:
        startConfigurationSet(id)


def deleteConfigurationSet(id):
    stopConfigurationSet(id)
    unloadConfigurationSet(id)
    configSetCollection.delete_one({"_id":ObjectId(id)})


def unloadConfigurationSet(id):
    with configSetLock:
        try:
            c = activeConfigurationSets.pop(id)
            del c
        except KeyError:
            pass


def configureConnections(connections):
    for conn in connections:
        outMod = getModule(conn['out'])
        inMod = getModule(conn['in'])
        inMod.associateInputModule(outMod.id)
        outMod.associateOutputModule(inMod.id)


def startConfigurationSet(id):
    configSet = getConfigurationSet(id)
    configSet.active = True
    notLoaded = []
    loaded = []

    # find which modules are already loaded
    with moduleLock:
        for m in configSet.modules:
            try:
                loaded.append((activeModules[m['id']].id, m['level']))
            except KeyError:
                notLoaded.append(m)

    for m in notLoaded:
        loadModule(m['id'])
        loaded.append(m)

    # sort by level
    configSet.modules.sort(key=lambda t: t['level'])

    configureConnections(configSet.connections)
    for m in configSet.modules:
        with moduleLock:
            module = activeModules[m['id']]
        w = worker.Worker(module)
        with workerLock:
            activeWorkers[m['id']] = w
        w.start()

def stopConfigurationSet(id):
    configSet = getConfigurationSet(id)
    if configSet.active == True:
        configSet.active = False
    else:
        return

    #stop workers first, will pbreak other running configs running the same workers
    #reverse sort module by level 
    configSet.modules.sort(key=lambda t: t['level'], reverse=True)
    with moduleLock:
        for m in configSet.modules:
            stopWorker(m['id'])
    

def stopWorker(id):
    with workerLock:
        try:
            activeWorkers[id].stop()
            activeWorkers.pop(id)
        except KeyError:
            pass


    
def getAllWorkersModuleID():
    data = []
    with workerLock:
        try:
            for id in activeWorkers.keys():
                m = moduleCollection.find_one({'_id':ObjectId(id)})
                data.append({'id': id, 'name': m['name'], 'description':m['description']})
        except KeyError:
            pass
    return data

def printGlobals():
    print(globals().keys())