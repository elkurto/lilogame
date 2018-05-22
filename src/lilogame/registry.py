import pw.configobjx
import lilogame.dao
import lilogame.authn
import random

class DescriptorConst(object):
  """
    This descriptor just makes an immutable string constant
  """
  def __init__(self, value):
    self.value =value
    
  def __get__(self, obj, _type=None):
    return self.value
  
class PayoutStrategyName(object):
  payout_per_player =DescriptorConst('payout_per_player')
  uniform_each =DescriptorConst('uniform_each')
  
class TileState(object):
  initial =DescriptorConst('initial')
  winner =DescriptorConst('winner')
  loser =DescriptorConst('loser')
  spinning =DescriptorConst('spinning')
    
class Tile(object):
  def __init__(self):
    self.id =None
    self.payout =None
    self.p_numerator =None
    self.p_denominator =None
    self.icon =None
    self.b_winner =False
    self.state =TileState.initial
    self.n_population = 0
    self.payout_per_player =0.0000
    self.payout_strategyname =PayoutStrategyName.payout_per_player
    self.payout_this_round =0
    self.dollars =0
    self.tenthouths =0
    
  @classmethod  
  def create_tile_0(cls):
    tile =Tile()
    tile.id =0
    tile.payout =40
    tile.p_numerator =1
    tile.p_denominator =2
    tile.icon ='../images/icon-slice-lemon.svg'
    tile.b_winner =False
    tile.state =TileState.initial
    tile.n_population = 0
    tile.payout_per_player ='0.0000'
    tile.payout_strategyname =PayoutStrategyName.payout_per_player
    
    return tile
  
  @classmethod  
  def create_tile_1(cls):
    tile =Tile()
    tile.id =1
    tile.payout =1
    tile.p_numerator =1
    tile.p_denominator =1
    tile.icon ='../images/icon-slice-lime.svg'
    tile.b_winner =False
    tile.state =TileState.initial
    tile.n_population = 0
    tile.payout_per_player ='1.0000'
    tile.payout_strategyname =PayoutStrategyName.uniform_each
    
    return tile
  
  @classmethod  
  def create_tile_2(cls):
    tile =Tile()
    tile.id =2
    tile.payout =80
    tile.p_numerator =1
    tile.p_denominator =4
    tile.icon ='../images/icon-slice-orange.svg'
    tile.b_winner =False
    tile.state =TileState.initial
    tile.n_population = 0
    tile.payout_per_player ='0.0000'
    tile.payout_strategyname =PayoutStrategyName.payout_per_player
    
    return tile  

def create_config_dev( ):
  c =pw.configobjx.ConfigObj()
  c.lilogame.authn.salt ='ALSDLSKJD954898'
  c.lilogame.authn.spinner.username ='elkurto'
  c.lilogame.authn.spinner.password ='YWVpb3Ux' #base64 of real password
  
  c.lilogame.dao.tiles =[Tile.create_tile_0(), Tile.create_tile_1(), Tile.create_tile_2()]
  c.fn_random =lambda : random.randint(0,1000)
  
  
  config =c.duplicate_to_object()
  return config

fn_create_config =create_config_dev


  
class Resname(object):
  config =DescriptorConst('config')
  dao =DescriptorConst('dao')
  authn =DescriptorConst('authn')
  

class Registry(object):
  """
    Registry - a singleton object that holds references 
    to resources (e.g. DAO). 
    Registry is a singleton and a service-locator
  """
  __instance =None
  
  def __new__(cls,*args,**kwargs):
    if Registry.__instance is None:
      Registry.__instance =object.__new__(cls)
      Registry.__instance.map_name_resource =dict()
      Registry.__instance.config =None
      Registry.__instance.__init_registry()
      
    return Registry.__instance

  def __init__(self,*args,**kwargs):
    print('in __init__')

    
  def __init_registry(self):
    print('in init_registry')
    # 1. init config
    self.config =fn_create_config()
    self.map_name_resource[ Resname.config ] =self.config
    
    # 2. init dao
    dao =lilogame.dao.Dao.create_from_config( self.config )
    self.map_name_resource[ Resname.dao ]= dao 
    
    # 3. init authn
    authn =lilogame.authn.Authn.create_from_config( self.config )
    self.map_name_resource[ Resname.authn ] = authn 
    
    
  @classmethod
  def reset(cls):
    Registry.__instance =None
    return Registry()
    
  def get_resource(self, name):
    resource =self.map_name_resource.get(name, None)
    return resource
    
def get_resource(name):
  """
    @param :str:name  
      the name of the resource
      
    @return :object:resource
  """
  resource =Registry().get_resource(name)
  return resource
  
def get_dao(): 
  return get_resource(Resname.dao)  
  
def get_config():
  return get_resource(Resname.config)  
  
def get_authn():
  return get_resource(Resname.authn)

def get_fn_random():
  config =get_resource(Resname.config)
  
  return config.fn_random 

  