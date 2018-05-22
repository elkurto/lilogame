import threading

class Player(object):
  def __init__(self, u, s):
    self.id =None
    self.u =u
    self.s =s
    self.dollars =0
    self.tenthouths =0
    self.cash ='0.0000'
    self.tileid =None
    self.prev_tileid =None
    self.index =None
    
class Gameroom(object):
  def __init__(self):
    self.id =0
    self.name ='Default'
    self.round =0    
    
class Dao(object):
  def __init__(self):
    self.spinner_lock =threading.RLock()
    self.b_spinner_block =False
    
    self.map_sessionid_player_index =dict()
    self.ary_player =[]
    self.config =None
    self.tiles =[]
    self.gameroom =Gameroom()
    self.initial_tileid =None
    
  @classmethod
  def create_from_config(cls, config ):
    dao =Dao()
    dao.config =config
    dao.tiles =config.lilogame.dao.tiles
    dao.initial_tileid =1 #@TODO make this a configuration item
    dao.round =0
      
    return dao 
    
  def lookup_player_by_sessionid(self,sessionid):
    index =self.map_sessionid_player_index.get(sessionid,None)
    
    player =None
    if index is None:
      #raise Exception('No such player for sessionid ={0}'.format(sessionid))
      pass
    elif 0 <= index and index < len(self.ary_player):
      player =self.ary_player[index] 
      
    return player

  def create_player(self, u, s ):
    player =Player(u,s)
    
    #@TODO: make a lock to constrol access to index
    #@TODO: make a proper player.id (instead of id := index)
    player =Player(u,s)
    player.id =player.index =index =len(self.ary_player)
    self.ary_player.append(player)
    self.map_sessionid_player_index[s] =index
    player.tileid =self.initial_tileid
    player.prev_tileid =self.initial_tileid
    self.tiles[self.initial_tileid].n_population +=1
    return player
  
  def get_players(self):
    return self.ary_player
  
  def get_tiles(self):
    return self.tiles
  
  def increment_round(self, inc=1):
    self.gameroom +=inc
    
  def get_gameroom(self):
    return self.gameroom
  
  