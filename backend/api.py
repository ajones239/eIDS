from flask import Flask, Response, request, jsonify
import controlplane
from modules import ModuleException

api = Flask(__name__)

@api.route('/health')
def ping():
    return Response(status = 204)

@api.route('/module', methods = ['POST'])
def addModule():
    try:
        resp = jsonify({'id': controlplane.addModule(request.get_json())})
        resp.status_code = 200
    except ModuleException as e:
        resp = jsonify({'error': e.message})
        resp.status_code = 400
    except Exception as e:
        resp = Response()
        resp.status_code = 500
    return resp

