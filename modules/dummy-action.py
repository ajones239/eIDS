class DummyAction(modules.Module, modules.ActionModule):

    def __init__(self):
        super(DummyAction, self).__init__()
        self.log('Starting Dummy Action Module')

    def start(self):
        pass

    def stop(self):
        pass

    def doAction(self):
        with open('/tmp/eIDS/out/outfile.txt', 'a') as f:
            f.write('ALERT!\n')


