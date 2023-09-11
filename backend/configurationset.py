
class ConfigurationSetException(Exception):

    def __init__(self, message):
        self.message = message


class ConfigurationSet:

    def __init__(self) -> None:
        self._id = None
        self.name = None
        self.description = None
        self.modules = None


def verifyConfigurationSetJson(cs):
    pass
