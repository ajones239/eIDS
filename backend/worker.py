import controlplane

from threading import RLock, Thread
import time


class Worker(Thread):

    def __init__(self, module):
        super(Worker, self).__init__()
        self.module = module
        self.active = True
        self.lock = RLock()

    def run(self):
        self.module.start()

        try:
            while True:
                self.module.associatedOutputModules.remove(None)
        except ValueError:
            pass
        try:
            while True:
                self.module.associatedInputModules.remove(None)
        except ValueError:
            pass

        while True:
            with self.lock:
                if not self.active:
                    break
            if self.module.hasOutput():
                for m in self.module.associatedOutputModules:
                    mod = controlplane.getModule(m)
                    mod.addInput(self.module.id, self.module.getOutput())
            time.sleep(1)
        self.module.stop()

    def stop(self):
        with self.lock:
            self.active = False

