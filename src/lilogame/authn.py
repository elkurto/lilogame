import lilogame.registry
import hashlib
import binascii


class Authn(object):
  def __init__(self):
    self.spinner =None
    self.salt =None
    self.config =None
    
  @classmethod
  def create_from_config(cls, config):
    authn =Authn()
    authn.spinner =config.lilogame.authn.spinner
    authn.salt =config.lilogame.authn.salt
    authn.spinner.sessionid =\
      authn.create_spinner_sessionid(authn.spinner.username, authn.spinner.password)
    return authn
  
  def is_valid_player(self, u, s ):
    """
      @param :str:u username from http-request-parameters
      @param :str:s sessionid from http-request-parameters
      
      @return :bool:b_is_valid_player
      
      @todo log failures
    """
    b_is_valid_player =False
    if not u:
      b_is_valid_player =False
    elif not s:
      b_is_valid_player =False
    else:
      dao =lilogame.registry.get_dao() 
      player =dao.lookup_player_by_sessionid( s )
      b_is_valid_player =(player and player.u == u)
      
    return b_is_valid_player
  
  def create_sessionid(self, u, p):
    s_up ='{u}:{p}'.format(u=u, p=p)
    
    derivedkey =hashlib.pbkdf2_hmac('sha256',bytes(s_up), bytes(self.salt), 1000)
    sessionid =binascii.hexlify( derivedkey ).upper()
    
    return sessionid
  
  def create_player_sessionid(self, u, p):
    sessionid =self.create_sessionid(u,p)
    return sessionid
  
  def create_spinner_sessionid(self, u, p):
    sessionid =self.create_sessionid(u,p)
    return sessionid
  
  def is_valid_spinner_authn(self, u, p):
    """
      @param :str:u
      @param :str:p
    """
    b_is_valid =False
    if u and u == self.spinner.username:
      if p and p == self.spinner.password:
        b_is_valid =True
      
    return b_is_valid  
      
  def is_valid_spinner_session(self, spinner_sessionid):
    b_is_valid =(spinner_sessionid == self.spinner.sessionid)
    return b_is_valid
    