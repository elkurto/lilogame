import collections

class Request(object):
  def __init__(self):
    self.cookie =collections.defaultdict()
    self.values =collections.defaultdict()
    
    