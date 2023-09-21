from threading import RLock, Thread


class Worker(Thread):

    def __init__(self, module):
        super(Worker, self).__init__()
        self.module = module
        self.active = True
        self.lock = RLock()

    def run(self):
        self.module.start()
        while True:
            with self.lock:
                if not self.active:
                    break
            pass
        self.module.stop()

    def stop(self):
        with self.lock:
            self.active = False

