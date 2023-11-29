from api import api, socketIO
from flask_socketio import SocketIO
import logging

logger = logging.getLogger('application')
logger.setLevel(logging.DEBUG)
sh = logging.StreamHandler()
sh.setLevel(logging.DEBUG)
sh.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
logger.addHandler(sh)

#api.run
socketIO.run(api)

