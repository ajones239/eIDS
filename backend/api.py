import configurationset
import controlplane
import modules

from flask import Flask, Response, request, jsonify
from flask_cors import CORS
from swagger_gen.lib.wrappers import swagger_metadata
from swagger_gen.swagger import Swagger


api = Flask(__name__)
api.debug = True
CORS(api)


@api.route('/health', methods=['POST', 'PUT', 'PATCH', 'GET', 'DELETE'])
@swagger_metadata(
    summary='Basic health check',
    description='Returns 204 is the backend is alive.',
    response_model=[(204, 'Success')]
)
def ping():
    return Response(status=204)

#region Module

@api.route('/module', methods=['POST'])
@swagger_metadata(
    summary='Add a new module',
    description='''Expects valid JSON request body. Ex)
{
    "name": "module name",
    "description": "description of module",
    "type": 1,
    "dependencies": [
        "array of packages that can be installed with `pip install package`"
    ],
    "implementation": "base64 encoded python file. Should be named <module name>.py",
    "data": {"JSON array of data, to be used internally by provided implementation"},
    "module_io_params": ["to", "be", "added"]
}''',
    response_model=[
        (200, 'Success. Returns JSON response. Ex {"id": "64fef75832f055aee44dbc52"}'),
        (400, 'Invalid request. Returns JSON response. Ex {"error": "error message"}')
    ]
)
def addModule():
    try:
        resp = jsonify({'id': controlplane.addModule(request.get_json())})
        resp.status_code = 200
    except modules.ModuleException as e:
        resp = jsonify({'error': e.message})
        resp.status_code = 400
    return resp


@api.route('/module/<id>', methods=['GET'])
@swagger_metadata(
    summary='Get a module',
    description='Returns module with the given ID',
    response_model=[
        (200, '''Success. Returns JSON response. Ex)
Ex)
{
    "name": "module name, should be name of custom module class, case insensitive",
    "description": "description of module",
    "type": 1,
    "dependencies": [
        "array of packages that can be installed with `pip install package`"
    ],
    "implementation": "base64 encoded python file. Should be named <module name>.py",
    "data": {"JSON object of data, to be used internally by provided implementation"},
    "module_io_params": ["to", "be", "added"]
}''')
    ]
)
def getModule(id):
    try:
        resp = jsonify(controlplane.getModuleJson(id))
    except modules.ModuleException as e:
        resp = jsonify({'error': e.message})
        resp.status_code = 400
    return resp


@api.route('/module', methods=['GET'])
@swagger_metadata(
    summary='Get all the modules',
    description='Returns all modules',
    response_model=[
        (200, '''Success. Returns JSON response. Ex)
[{
    "name": "module name, should be name of custom module class, case insensitive",
    "description": "description of module",
    "type": 1,
    "dependencies": [
        "array of packages that can be installed with `pip install package`"
    ],
    "implementation": "base64 encoded python file. Should be named <module name>.py",
    "data": {"JSON object of data, to be used internally by provided implementation"},
    "module_io_params": ["to", "be", "added"]
}]''')
    ]
)
def getAllModules():
    return jsonify(controlplane.getAllModulesJson())


@api.route('/module/<id>/input/<data>', methods=['POST'])
@swagger_metadata(
    summary='Add input to a module',
    description='Inputs a base64 encoded string to the module with the given ID',
    response_model=[
        (204, 'Success'),
        (400, 'Invalid request. Returns JSON response. Ex {"error": "error message"}')
    ]
)
def addInputToModule(id, data):
    try:
        module = controlplane.getModuleWithException(id)
    except modules.ModuleException as e:
        resp = jsonify({'error': e.message})
        resp.status_code = 400
        return resp
    module.addInput('', data)
    return Response(status=204)

@api.route('/module/<id>/update', methods=['PUT'])
@swagger_metadata(
    summary='Update Module',
    description='Updates module with the given ID using data in body',
    response_model=[
        (200, 'Success'),
        (400, 'Invalid request. Returns JSON response. Ex {"error": "error message"}')
    ]
)
def updateModule(id):
    try:
        controlplane.updateModule(id,request.get_json())
    except modules.ModuleException as e:
        resp = jsonify({'error': e.message})
        resp.status_code = 400
    return Response(status=200)

@api.route('/module/<id>', methods=['DELETE'])
@swagger_metadata(
    summary='Delete module',
    description='Delete module from DB and stops active modules/configurations',
    response_model=[
        (200, 'Success'),
        (400, 'Invalid request. Returns JSON response. Ex {"error": "error message"}')
    ]
)
def deleteModule(id):
    try:
        controlplane.deleteModule(id)
    except Exception as e:
        resp = jsonify({'error': str(e)})
        resp.status = 400
        return resp
    return Response(status=200)
    



#endregion

#region Configuration
@api.route('/configuration', methods=['POST'])
@swagger_metadata(
    summary='Add a new configuration set',
    description='''Expects valid JSON request body. Ex)
{
    "name": "configuration set name",
    "description": "description of module configuration set",
    "modules": [
        {
            "id": "module ID",
            "level": 0
        }
    ],
    "connections": [
        {
            "out": "module ID",
            "in": "module ID"
        }
    ]
}. Modules are run in order of their levels, in increasing order''',
    response_model=[
        (200, 'Success. Returns JSON response. Ex {"id": "64fef75832f055aee44dbc52"}'),
        (400, 'Invalid request. Returns JSON response. Ex {"error": "error message"}')
    ]
)
def addConfiguration():
    try:
        resp = jsonify({'id': controlplane.addConfigurationSet(request.get_json())})
        resp.status_code = 200
    except configurationset.ConfigurationSetException as e:
        resp = jsonify({'error': e.message})
        resp.status_code = 400
    return resp


@api.route('/configuration/<id>', methods=['GET'])
@swagger_metadata(
    summary='Get a configuration set',
    description='Returns config set with the given ID.',
    response_model=[
        (200, '''Success. Returns JSON response. Ex)
{
    "name": "configuration set name",
    "description": "description of module configuration set",
    "modules": [
        {
            "id": "module ID",
            "level": 0
        }
    ],
    "connections": [
        {
            "out": "module ID",
            "in": "module ID"
        }
    ]
}''')
    ]
)
def getConfiguration(id):
    return jsonify(controlplane.getConfigurationSetJson(id))


@api.route('/configuration', methods=['GET'])
@swagger_metadata(
    summary='Get all the configuration sets',
    description='Returns all configuration sets',

    response_model=[
            (200, '''Success. Returns JSON response. Ex)
                [{
                    "name": "configuration set name",
                    "description": "description of module configuration set",
                    "modules": [
                        {
                            "id": "module ID",
                            "level": 0
                        }
                    ],
                    "connections": [
                        {
                            "out": "module ID",
                            "in": "module ID"
                        }
                    ]
                }]''')
    ]
)
def getAllConfigurationSets():
    return jsonify(controlplane.getAllConfigurationSetsJson())

@api.route('/configuration/active', methods=['GET'])
@swagger_metadata(
    summary='Get all the active configuration sets',
    description='Returns all active configuration sets',

    response_model=[
            (200, '''Success. Returns JSON response with list. Ex)
                [{
                    "name": "configuration set name",
                    "description": "description of module configuration set",
                    "modules": [
                        {
                            "id": "module ID",
                            "level": 0
                        }
                    ],
                    "connections": [
                        {
                            "out": "module ID",
                            "in": "module ID"
                        }
                    ]
                }],...''')
    ]
)
def getAllActiveConfigurationSets():
    return jsonify(controlplane.getAllActiveConfigurationSetsJson())






@api.route('/configuration/<id>/update', methods=['PUT'])
@swagger_metadata(
    summary='Update Configuration Set',
    description='Updates configuration set with the given ID using data in body. Will stop set if active along sets with similar workers',
    response_model=[
        (200, 'Success'),
        (400, 'Invalid request. Returns JSON response. Ex {"error": "error message"}')
    ]
)
def updateConfiguration(id):
    try:
        controlplane.updateConfigurationSet(id,request.get_json())
    except configurationset.ConfigurationSetException as e:
        resp = jsonify({'error': e.message})
        resp.status_code = 400
    return Response(status=200)

@api.route('/configuration/<id>', methods=['DELETE'])
@swagger_metadata(
    summary='Delete configuration set',
    description='Delete configuration set from DB and stops active configurations/workers',
    response_model=[
        (200, 'Success'),
        (400, 'Invalid request. Returns JSON response. Ex {"error": "error message"}')
    ]
)
def deleteConfiguration(id):
    try:
        controlplane.deleteConfigurationSet(id)
    except configurationset.ConfigurationSetException as e:
        resp = jsonify({'error': e.message})
        resp.status_code = 400
        return resp
    return Response(status=200)
    

@api.route('/configuration/<id>', methods=['POST'])
@swagger_metadata(
    summary='Start a configuration set (runs all modules in set)',
    description='Starts all modules in a configuration set.',
    response_model=[
        (204, 'Success'),
        (400, 'Invalid request. Returns JSON response. Ex {"error": "error message"}')
    ]
)
def startConfigurationSet(id):
    try:
        controlplane.startConfigurationSet(id)
        return Response(status=204)
    except configurationset.ConfigurationSetException as e:
        resp = jsonify({'error': e.message})
        resp.status_code = 400
        return resp
    

@api.route('/configuration/<id>/stop', methods=['POST'])
@swagger_metadata(
    summary='Stop a configuration set',
    description='Stops all active workers from a config sets and related config sets using same workers.',
    response_model=[
        (204, 'Success'),
        (400, 'Invalid request. Returns JSON response. Ex {"error": "error message"}')
    ]
)
def stopConfigurationSet(id):
    try:
        controlplane.stopConfigurationSet(id)
        return Response(status=204)
    except configurationset.ConfigurationSetException as e:
        resp = jsonify({'error': e.message})
        resp.status_code = 400
        return resp

#endregion


#region worker

@api.route('/worker', methods=['GET'])
@swagger_metadata(
    summary='Returns all worker module IDs',
    description='Get all active IDs of modules used by workers',
    response_model=[
        (200, '''Success. Returns JSON response. Ex)
[{
    "modules": List of module IDs
}]''')
    ]
)
def getAllWorkers():
    return jsonify(controlplane.getAllWorkersModuleID())

@api.route('/global', methods=['GET'])
@swagger_metadata(
    summary='Prints globals',
    description='Print globals',
    response_model=[
        (200, 'Success')
    ]
)
def printGlobals():
    controlplane.printGlobals()
    print(globals().keys())
    return Response(status=200)

#endregion

swagger = Swagger(
    app=api,
    title='eIDS backend API',
    url='/ui'
)
swagger.configure()
