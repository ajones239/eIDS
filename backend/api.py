import configurationset
import controlplane
import modules

from flask import Flask, Response, request, jsonify
from flask_cors import CORS
from swagger_gen.lib.wrappers import swagger_metadata
from swagger_gen.swagger import Swagger


api = Flask(__name__)
CORS(api)

@api.route('/health', methods=['POST', 'PUT', 'PATCH', 'GET', 'DELETE'])
@swagger_metadata(
    summary='Basic health check',
    description='Returns 204 is the backend is alive.',
    response_model=[(204, 'Success')]
)
def ping():
    return Response(status=204)


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
    ]
}''')
    ]
)
def getConfiguration(id):
    return jsonify(controlplane.getConfigurationSetJson(id))


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


swagger = Swagger(
    app=api,
    title='eIDS backend API',
    url='/ui'
)

swagger.configure()
