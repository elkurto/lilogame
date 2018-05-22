import pw.pw_util

class ConfigObj(object):
  """
    
    e.g.
      configdata =flosimpy.configobjx.ConfigObj()  # 1. make a ConfigObj
      configdata.a.b.c =100   # 2. Create fields configdata.a, configdata.a.b, configdata.a.b.c 
                              #     and make assignment to configdata.a.b.c =100
      
  """
  def __init__(self,**kwargs):
    self.__dict__.update(kwargs)
    
  def __getattr__(self,attrname,*args):
    """
      Auto create (auto-vivify) fields if attrname is not present.
      
      Autovivified fields  is very convenient for making heirachical
      configuration objects.
      
      E.G.
      configdata =flosimpy.configobjx.ConfigObj()  # 1. make a ConfigObj
      configdata.a.b.c =100   # 2. Create fields configdata.a, configdata.a.b, configdata.a.b.c 
                              #     and make assignment to configdata.a.b.c =100
       
    """
    attrvalue =None
    try:
      attrvalue =object.__getattribute__(self,attrname)
    except AttributeError: 
      if len(args) > 0:
        attrvalue =args[0]
      else:
        attrvalue =ConfigObj()
      self.__dict__[attrname] =attrvalue
    
    return attrvalue
  
  def __hasattr__(self, attrname):
    return self.hasattr(attrname)
  
  def hasattr(self,dotted_path):
    list_path =dotted_path.split('.')
    
    b_hasattr =False
    if len(list_path) > 0:
      b_hasattr =self._hasattr(list_path, self, index=0)
        
    return b_hasattr
    
  def _hasattr(self,list_path,parent,index=0):
    b_hasattr =True
    try:
      attrvalue =object.__getattribute__(parent, list_path[index])
      
      if index+1 < len(list_path):
        b_hasattr =self._hasattr(list_path, attrvalue, index+1)
    except AttributeError:
      b_hasattr =False
      
    return b_hasattr
    
    
  def lookup(self, dotted_path, default=None ):
    list_path =dotted_path.split('.')
    rval =default
    try:
      rval =self._lookup_list_path_in_object(list_path, parent=self, index=0)
    except AttributeError:
      rval =default
      
    return rval 
  
  def _lookup_list_path_in_object(self, list_path, parent, index=0):
    
    attrvalue =object.__getattribute__(parent,list_path[index])
    
    if index +1< len(list_path):
      
      attrvalue =self._lookup_list_path_in_object(list_path, attrvalue, index+1)
    
    return attrvalue
  
  
  #   def deepcopy(self):
  #     import copy
  #      
  #     dup =flosimpy.constantsx.Object()
  #      
  #     for attrname,attrvalue in self.__dict__.iteritems():
  #       if attrname == '__members__':
  #         print('bad case 1 ::: __members__::: attrname =',attrname)
  #       if attrname == '__methods__':
  #         print('bad case 2 ::: __methods__::: attrname =',attrname)
  #        
  #        
  #       if isinstance(attrvalue, ConfigObj):
  #         setattr(dup, attrname, attrvalue.deepcopy())
  #       else:
  #         setattr(dup, attrname, copy.deepcopy(attrvalue))
  #       #end-if
  #     #end-for
  #      
  #     print('orig =',self)
  #     print('dup =',dup)
  #     return dup
  def deepcopy(self):
    return self.duplicate_to_object()
  
  def duplicate_to_object(self):
    import copy
    
    dup =pw.pw_util.Object()
    
    for attrname,attrvalue in self.__dict__.iteritems():
      if isinstance(attrvalue, ConfigObj):
        setattr(dup, attrname, attrvalue.duplicate_to_object())
      else:
        setattr(dup, attrname, copy.deepcopy(attrvalue))
      #end-if
    #end-for
    
    #print('orig =',self)
    #print('dup =',dup)
    return dup
  
  def __str__(self):
    import io
    buff =io.StringIO()
    for key,val in self.__dict__.iteritems():
      buff.write(unicode(key))
      buff.write('=')
      buff.write(unicode(val))
      
    return buff.getvalue()
  
  def __repr__(self):
    return self.__str__()
  
