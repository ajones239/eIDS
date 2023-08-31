from flask import Flask, Response, request, jsonify
import uuid
import pymongo

api = Flask(__name__)

dbclient = pymongo.MongoClient('mongodb://localhost:27017/')
moduleCollection = dbclient['eIDS']['modules']

@api.route('/health')
def ping():
    return Response(status = 204)

@api.route('/module', methods = ['POST'])
def addModule():
    m = request.get_json()
    m['_id'] = str(uuid.uuid4())
    dbres = moduleCollection.insert_one(m)
    resp = jsonify({'id': dbres.inserted_id})
    resp.status_code = 200
    return resp

def runApi():
    api.run()
