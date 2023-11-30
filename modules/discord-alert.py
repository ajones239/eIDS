import requests

class DiscordAlert(modules.Module, modules.ActionModule):

    def __init__(self):
        super(DiscordAlert, self).__init__()
        self.log('Starting Discord Alert Module')

    def start(self):
        self.webhook_url = self.data['webhook_url']

    def stop(self):
        pass

    def doAction(self):
        msg = {
            'content': 'ALERT: Attack detected!'
        }
        requests.post(self.webhook_url, json=msg)

