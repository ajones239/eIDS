import requests

class DiscordAlert(modules.Module, modules.ActionModule):

    def __init__(self):
        super(DiscordAlert, self).__init__()

    def start(self):
        self.webhook_url = self.data['webhook_url']
        self.log('Starting Discord Alert Module')

    def stop(self):
        pass

    def doAction(self, data):
        alert = 'ALERT: ' + data + ' attack detected!'
        self.log('Sending alert to Discord: ' + alert)
        msg = {
            'content': alert
        }
        requests.post(self.webhook_url, json=msg)

