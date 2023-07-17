from flask import Flask

api = Flask(__name__)

@api.route('/ping')
def ping():
    return 'ping!'

def runApi():
    api.run()
