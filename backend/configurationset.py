class ConfigurationSetException(Exception):

    def __init__(self, message):
        self.message = message


class ConfigurationSet:

    def __init__(self, json) -> None:
        self.id = json.get('id')
        self.name = json.get('name')
        self.description = json.get('description')
        self.modules = json.get('modules')
        self.connections = json.get('connections')
        self.actionConditions = json.get('actionConditions')
        self.active = False


