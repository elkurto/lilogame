import flask
import random
import math
import logging
import lilogame.registry
import pyppa.json_ez
import lilogame.authn

def lilogame_spinnerauthn( request ):
  resp =None
  
  u =request.values.get('u')
  p =request.values.get('p')
  print('1')
  authn =lilogame.registry.get_authn() 
  if authn.is_valid_spinner_authn( u, p ):
    ss =authn.spinner.sessionid
    print('2')
    url =flask.url_for('static_lilogame_spinner_html')
    resp =flask.redirect(url)
    resp.set_cookie(key='ss',value=ss)
  else:
    print('3')
    url =flask.url_for('static_lilogame_login_spinner_html')
    resp =flask.redirect(url)
    
  return resp
  
def lilogame_playerauthn( request ):
  resp =None
  # 1. get http-request-param, u and p
  # 2. compute sessionid from u and p 
  # 3. process authn request
  #    [player with name does not exist ]
  #      , then add player to game and redirt to gameboard
  #    [player with name already exist and sessionid matches]
  #      , then redirect to gameboard
  #    [player with name already exist and sessionid not matches]
  #      , then redirect to spinnerauthn
  
  
  # 1.   
  u =request.values.get('u')
  p =request.values.get('p')
  
  # 2. 
  authn =lilogame.registry.get_authn() 
  s =authn.create_player_sessionid(u,p)
  
  # 3. 
  dao =lilogame.registry.get_dao()
  player =dao.lookup_player_by_sessionid( s )
  if player is None:
    dao.create_player( u, s )
    url =flask.url_for('static_lilogame_gameboard_html')
    url ='{url}?u={u}&s={s}'.format(url=url, u=u, s=s)
    resp =flask.redirect(url)
    
  else:  
    # A player exists with sessiond, s, but does the username match?
    if player.u == u:  
      #'username and sessionid match'
      url =flask.url_for('static_lilogame_gameboard_html')
      url ='{url}?u={u}&s={s}'.format(url=url, u=u, s=s)
      resp =flask.redirect(url)
      
    else: 
      # username does not match with sessionid
      url =flask.url_for('static_lilogame_login_html')
      url ='{url}?u={u}&s={s}'.format(url=url, u=u, s=s)
      resp =flask.redirect(url)
    
  return resp

def rest_gameroom_get( request ):
  resp =None
  
  try:
    dao =lilogame.registry.get_dao()
    tiles =dao.get_tiles()
    gameroom =dao.get_gameroom()
    players =dao.get_players()
    
    # ensure field value of tile.n_population
    for tile in tiles:
      tile.n_population =_fn_count_players_in_tile(players, tile.id)
      
    resp_dict =dict( gameroom = gameroom, tiles =tiles)
    resp_json =pyppa.json_ez.json.toJson(resp_dict)
    resp =flask.make_response((resp_json, 200, {'Content-Type':'text/plain'}))
  except:
    errmsg ='exception in rest_gameroom_get'
    logging.exception(errmsg)
    resp_dict =dict( errmsg = errmsg)
    resp_json =pyppa.json_ez.json.toJson(resp_dict)
    resp =flask.make_response((resp_json, 200, {'Content-Type':'text/plain'}))

  return resp

def rest_spinner_spin( request ):
  resp =None
  # @TODO: validate requester
  # 0. acquire lock
  #
  try:
    if not _is_valid_spinner_session(request): 
      errmsg ='exception in rest_spinner_spin :: not valid spinner'
      logging.error(errmsg) 
      resp_dict =dict(errmsg=errmsg)
      resp_json =pyppa.json_ez.json.toJson(resp_dict)
      #print('resp_json =',resp_json)
      resp =flask.make_response((resp_json, 200, {'Content-Type':'text/plain'}))  
    else:
    
      dao =lilogame.registry.get_dao()
      with dao.spinner_lock:
        # 1. for each tile in dao.tiles ; compute win/lose and payout and payout_per_player  
        #  
        # 2. update players  (conditionally distribute winnings)
        #
        _rest_spinner_spin(request)
          
        # 3. compose resp
        #
        #dao =lilogame.registry.get_dao()
        gameroom =dao.get_gameroom()
        tiles =dao.get_tiles()
        resp_dict =dict(gameroom = gameroom, tiles = tiles )
        resp_json =pyppa.json_ez.json.toJson(resp_dict)
        print('resp_json =',resp_json)
        resp =flask.make_response((resp_json, 200, {'Content-Type':'text/plain'}))
    
  except:
    errmsg ='exception in rest_spinner_spin'
    logging.exception(errmsg) 
    resp_dict =dict(errmsg=errmsg)
    resp_json =pyppa.json_ez.json.toJson(resp_dict)
    print('resp_json =',resp_json)
    resp =flask.make_response((resp_json, 200, {'Content-Type':'text/plain'}))    
  
  return resp

def _rest_spinner_spin(request):
  dao =lilogame.registry.get_dao()
  tiles =dao.get_tiles()
  players =dao.get_players()
  gameroom =dao.get_gameroom()
  
  gameroom.round +=1
  
  # 1. for each tile in dao.tiles ;  
  #  
  for idx in xrange(0,len(tiles)):
    # 1.1. compute payout per player
    tile =tiles[idx]
    if tile.payout_strategyname == lilogame.registry.PayoutStrategyName.uniform_each:
      tile.n_population =_fn_count_players_in_tile( players, tile.id)
      
      fn_random =lilogame.registry.get_fn_random()
      i_rand_x_1000 = fn_random()  # typically equaivalent to random.randint(0,1000)
      if i_rand_x_1000 <= (tile.p_numerator * 1000.0 / tile.p_denominator):
        tile.state ='winner'
        tile.dollars =tile.payout
        tile.tenthouths =0
        tile.payout_per_player =_fn_format_dollars_and_tenthouths(tile.dollars, tile.tenthouths )
        tile.payout_this_round =_fn_format_dollars_and_tenthouths(tile.dollars * tile.n_population, tile.tenthouths * tile.n_population)
        
      else:
        tile.state ='loser'
        tile.dollars =0
        tile.tenthouths =0
        tile.payout_per_player =_fn_format_dollars_and_tenthouths(tile.dollars, tile.tenthouths )
        tile.payout_this_round =tile.payout_per_player
      
    elif tile.payout_strategyname == lilogame.registry.PayoutStrategyName.payout_per_player:
      
      # count the number of players that chose this tile.
      tile.n_population =_fn_count_players_in_tile( players, tile.id)
      fn_random =lilogame.registry.get_fn_random()
      i_rand_x_1000 = fn_random()  # typically equaivalent to random.randint(0,1000)
      if i_rand_x_1000 <= (tile.p_numerator * 1000.0 / tile.p_denominator):
        tile.state ='winner'
        tile.payout_this_round =tile.payout
        _fn_compute_and_update_payout_per_player( tile )
        
      else:
        tile.state ='loser'
        tile.dollars =0
        tile.tenthouths =0
        tile.payout_this_round ='0.0000'
        
  # 2. update players  (conditionally distribute winnings)
  #
  for player in players:
    # for each player 
    # 2.1 distribute winnings
    if 0 <= player.tileid and player.tileid < len(tiles):
      tile =tiles[ player.tileid ]
      player.dollars += tile.dollars
      player.tenthouths   += tile.tenthouths
      
      (carried_dollars, tenthouths) =divmod( player.tenthouths , 10000 )
      player.dollars     += math.trunc(carried_dollars)
      player.tenthouths   = math.trunc(tenthouths)
      player.cash =_fn_format_dollars_and_tenthouths(player.dollars, player.tenthouths)
    else: 
      continue
    
    # 2.2 conditionally charge a dollar for switching tiles. 
    if player.prev_tileid != player.tileid:
      player.dollars -=1  # @TODO un-hard-code cost to switch
      player.cash =_fn_format_dollars_and_tenthouths(player.dollars, player.tenthouths)
      
    # 2.3. update player.prev_tileid
    player.prev_tileid = player.tileid
      
  return True

def _fn_format_dollars_and_tenthouths( dollars, tenthouths ):
  s_cash ='{0}.{1}'.format(dollars, str(tenthouths).rjust(4, '0'))
  return s_cash
  
def _fn_count_players_in_tile( players, tileid ):
  n_pop =reduce( lambda x,y: x+1, filter( lambda p: p.tileid == tileid, players ), 0)
  return n_pop

def _fn_compute_and_update_payout_per_player( tile ):
  
  
  if tile.n_population <= 1:
    (dollars, tenthouths) =divmod(tile.payout * 10000.0 / 1, 10000)
    tile.dollars =dollars =math.trunc( dollars )
    tile.tenthouths   =tenthouths   =math.trunc( tenthouths )
    tile.payout_per_player =_fn_format_dollars_and_tenthouths( dollars, tenthouths )
    
  else:
    payout_x_10000 =tile.payout * 10000.0
    
    (dollars,tenthouths) =divmod( payout_x_10000 / tile.n_population, 10000 )
    tile.dollars =dollars =math.trunc( dollars )
    tile.tenthouths   =tenthouths   =math.trunc( tenthouths )
    
    tile.payout_per_player ='{0}.{1}'.format(dollars, str(tenthouths).rjust(4, '0'))
    
  return 

def rest_currenttile_player_tile( request, playerid, tileid ):
  resp =None
  
  try:
    i_tileid =int(tileid)
    i_playerid =int(playerid)
    
    u =request.values.get('u')
    s =request.values.get('s')
    
    # 0. acquire lock or wait
    #
    # 1. lookup player_index by sessionid 
    #    ensure that username matches
    #    [ username != u ] then create error-resp and return error-resp  
    if _is_valid_player(request):
      pass
    elif _is_valid_username_string(u) and _is_valid_sessionid_string(s) and not _username_in_use(u):
      # then username not in use, so use sessionid to create a new player
      #  this case is useful in gracefully dealing with server restarts and game resets
      #  (i.e. this case avoid forcing players to reauth after game reset or server restart).
      dao =lilogame.registry.get_dao()
      dao.create_player( u, s )
    else:
      raise Exception('not auth : no match user/session')
    
    dao =lilogame.registry.get_dao()
    s =request.values.get('s')
    player =dao.lookup_player_by_sessionid(s)
    
    
   
    # 2. if player.tileid != tileid
    #   player.tileid =tileid
    #   player.cash_on_hand -= 1
    #
    tiles =dao.get_tiles()
    i_tileid =int(tileid)
    if player.tileid != i_tileid:
      # then player wants to change tiles
      #player.dollars -= 1  # charge player a dollar
      
      ## shift populations by 1
      with dao.spinner_lock:
        if 0 <= player.tileid and player.tileid < len(tiles):
          tiles[player.tileid].n_population -=1
        if 0 <= i_tileid and i_tileid < len(tiles):
          tiles[i_tileid].n_population +=1
        
    # assign i_tileid  
    player.tileid =i_tileid
       
    # 3. compose response
    gameroom =dao.get_gameroom()
    
    resp_dict =dict(gameroom=gameroom, tiles=tiles, player=player)
    resp_json =pyppa.json_ez.json.toJson(resp_dict)
    resp =flask.make_response((resp_json, 200, {'Content-Type':'text/plain'})) 
    
  except:
    errmsg ='exception in rest_currenttile_player_tile'
    logging.exception(errmsg)
    resp_dict =dict( errmsg = errmsg)
    resp_json =pyppa.json_ez.json.toJson(resp_dict)
    resp =flask.make_response((resp_json, 200, {'Content-Type':'text/plain'}))
    
  return resp  

# def rest_spinner(request):
#   resp =None
#   try:
#     dao =lilogame.registry.get_dao()
#     tiles =dao.get_tiles()
#     gameroom =dao.get_gameroom()
#     
#     resp_dict =dict(gameroom=gameroom, tiles=tiles)
#     resp_json =pyppa.json_ez.json.toJson(resp_dict)
#     resp =flask.make_response((resp_json, 200, {'Content-Type':'text/plain'}))     
#   except:
#     errmsg ='exception in rest_spinner'
#     logging.exception(errmsg)
#     resp_dict =dict( errmsg = errmsg)
#     resp_json =pyppa.json_ez.json.toJson(resp_dict)
#     resp =flask.make_response((resp_json, 200, {'Content-Type':'text/plain'}))
#     
#   return resp

def rest_gameroom_player( request ):
  resp =None
  u = None
  s =None
  
  try:
    
    u =request.values.get('u', None)
    s =request.values.get('s', None)
    if _is_valid_player( request ):
      pass
    elif _is_valid_username_string(u) and _is_valid_sessionid_string(s) and not _username_in_use(u):
      # then username not in use, so use sessionid to create a new player
      #  this case is useful in gracefully dealing with server restarts and game resets
      #  (i.e. this case avoid forcing players to reauth after game reset or server restart).
      dao =lilogame.registry.get_dao()
      dao.create_player( u, s )
      
      
    else: 
      raise Exception('Not auth, in rest_gameroom_player ::: u ={u} , s={s}'.format(u=u,s=s))
    
    dao =lilogame.registry.get_dao()
    gameroom =dao.get_gameroom()
    tiles =dao.get_tiles()
    player =dao.lookup_player_by_sessionid(s)
    
    resp_dict =dict(gameroom=gameroom, tiles=tiles, player=player)
    resp_json =pyppa.json_ez.json.toJson(resp_dict)
    resp =flask.make_response((resp_json, 200, {'Content-Type':'text/plain'})) 
  except:
    errmsg ='exception in rest_gameroom_player'
    logging.exception(errmsg)
    resp_dict =dict( errmsg = errmsg)
    resp_json =pyppa.json_ez.json.toJson(resp_dict)
    resp =flask.make_response((resp_json, 200, {'Content-Type':'text/plain'}))
    
  
  return resp

def _is_valid_player( request ):
  u =request.values.get('u', None)
  s =request.values.get('s', None)
  authn =lilogame.registry.get_authn()
  b_is_valid =authn.is_valid_player(u,s)
  return b_is_valid

def _is_valid_spinner( request ):
  u =request.values.get('u', None)
  s =request.values.get('s', None)
  
  authn =lilogame.registry.get_authn()
  b_is_valid =authn.is_valid_spinner_authn(u,s)
  
  return b_is_valid

def _is_valid_spinner_session( request ):
  ss =request.cookies.get('ss')
  
  authn =lilogame.registry.get_authn()
  b_is_valid =authn.is_valid_spinner_session( ss )
  
  return b_is_valid

def _is_valid_username_string(u):
  b_is_valid =False
  if u :
    b_is_valid =True
    
  return b_is_valid

def _is_valid_sessionid_string(s):
  b_is_valid =False
  if s and len(s) == 64:
    b_is_valid =True
    
  return b_is_valid

def _username_in_use( u ):
  dao =lilogame.registry.get_dao()
  players =dao.get_players()
  b_username_in_use =False
  for player in players :
    if player.u == u:
      b_username_in_use =True
      break
  #end-for
  return b_username_in_use
  
  
def rest_reset_all_player_cash( request ):
  resp =None
  try:
    if not _is_valid_spinner_session( request ):
      resp_dict =dict(errmsg="not authorized to reset player cash")
      resp_json =pyppa.json_ez.json.toJson(resp_dict)
      resp =flask.make_response((resp_json,200,{'Content-Type':'text/plain'}))
    else:
      dao =lilogame.registry.get_dao()
      with dao.spinner_lock:
        for player in dao.get_players():
          player.dollars =0
          player.tenthoughs =0
          player.cash =_fn_format_dollars_and_tenthouths(dollars=0, tenthouths=0)
          
      resp_dict =dict(msg='okay')
      resp_json =pyppa.json_ez.json.toJson(resp_dict)
      resp =flask.make_response((resp_json,200,{'Content-Type':'text/plain'}))
      
  except:
    errmsg ='exception in rest_reset_all_player_cash'
    logging.exception(errmsg)
    resp_dict =dict( errmsg = errmsg)
    resp_json =pyppa.json_ez.json.toJson(resp_dict)
    resp =flask.make_response((resp_json, 200, {'Content-Type':'text/plain'}))
  
  return resp

def rest_reset_round_counter( request ):
  resp =None
  try:
    if not _is_valid_spinner_session( request ):
      resp_dict =dict(errmsg="not authorized to reset gameroom round")
      resp_json =pyppa.json_ez.json.toJson(resp_dict)
      resp =flask.make_response((resp_json,200,{'Content-Type':'text/plain'}))
    else:
      dao =lilogame.registry.get_dao()
      gameroom =dao.get_gameroom()
      with dao.spinner_lock:
        gameroom.round =0
          
      resp_dict =dict(msg='okay')
      resp_json =pyppa.json_ez.json.toJson(resp_dict)
      resp =flask.make_response((resp_json,200,{'Content-Type':'text/plain'}))
      
  except:
    errmsg ='exception in rest_reset_round_counter'
    logging.exception(errmsg)
    resp_dict =dict( errmsg = errmsg)
    resp_json =pyppa.json_ez.json.toJson(resp_dict)
    resp =flask.make_response((resp_json, 200, {'Content-Type':'text/plain'}))
  
  return resp  
  
def rest_all_tile_option( request ):
  resp =None
  try:
      dao =lilogame.registry.get_dao()
      gameroom =dao.get_gameroom()
      tiles =dao.get_tiles()
      tileoptions =dict( list_payout_strategyname = [lilogame.registry.PayoutStrategyName.uniform_each
                                                    ,lilogame.registry.PayoutStrategyName.payout_per_player ]
                        )
          
      resp_dict =dict(gameroom=gameroom, tiles=tiles, tileoptions=tileoptions)
      resp_json =pyppa.json_ez.json.toJson(resp_dict)
      resp =flask.make_response((resp_json,200,{'Content-Type':'text/plain'}))
      
  except:
    errmsg ='exception in rest_reset_round_counter'
    logging.exception(errmsg)
    resp_dict =dict( errmsg = errmsg)
    resp_json =pyppa.json_ez.json.toJson(resp_dict)
    resp =flask.make_response((resp_json, 200, {'Content-Type':'text/plain'}))
    
  
  return resp  
  
def rest_tile_tileid_get( request , tileid):  
  resp =None
  try:
      i_tileid =int(tileid)
      dao =lilogame.registry.get_dao()
      tiles =dao.get_tiles()
      tile =None
      for temp_tile in tiles:
        if temp_tile.id == i_tileid:
          tile =temp_tile
          break;
      
      if tile is None:
        tile =dict(id=tileid, errmsg="No such tile with tile.id={0}".format(tileid))
      resp_json =pyppa.json_ez.json.toJson(tile)
      resp =flask.make_response((resp_json,200,{'Content-Type':'text/plain'}))
      
  except:
    errmsg ='exception in rest_tile_tileid_get'
    logging.exception(errmsg)
    resp_dict =dict( errmsg = errmsg)
    resp_json =pyppa.json_ez.json.toJson(resp_dict)
    resp =flask.make_response((resp_json, 200, {'Content-Type':'text/plain'}))
    
  
  return resp
  
def rest_tile_tileid_patch( request , tileid ):
  resp =None
  
  try:
    
    if not _is_valid_spinner_session( request ):
      resp_dict =dict(errmsg="not authorized to rest_tile_tileid_patch")
      resp_json =pyppa.json_ez.json.toJson(resp_dict)
      resp =flask.make_response((resp_json,200,{'Content-Type':'text/plain'}))
    else:
      req_json =request.data
      xfer_tile =pyppa.json_ez.json.fromJsonToObject(req_json)
      
      dao =lilogame.registry.get_dao()
      tiles =dao.get_tiles()
      
      # find the target tile
      xfer_tile_id =getattr(xfer_tile, 'id', None)
      xfer_tile_payout =getattr(xfer_tile, 'payout', None)
      xfer_tile_p_numerator =getattr(xfer_tile, 'p_numerator', None)
      xfer_tile_p_denominator =getattr(xfer_tile, 'p_denominator', None)
      xfer_tile_payout_strategyname =getattr(xfer_tile, 'payout_strategyname', None)
      
      tile_target =None
      for temp_tile in tiles:
        if temp_tile.id == xfer_tile.id:
          tile_target =temp_tile
          break;
        
      if tile_target is None:
        tile_target =dict(id=xfer_tile_id
                         , errmsg="No such tile with xfer_tile.id={0}".format(xfer_tile.id)
                         )
      else:
        with dao.spinner_lock:
          if xfer_tile_id is not None:
            tile_target.id =xfer_tile_id
            
          if xfer_tile_payout is not None:
            tile_target.payout =xfer_tile_payout
          
          if xfer_tile_p_numerator is not None:
            tile_target.p_numerator =xfer_tile_p_numerator
          
          if xfer_tile_p_denominator is not None:
            tile_target.p_denominator =xfer_tile_p_denominator
          
          if xfer_tile_payout_strategyname is not None:
            tile_target.payout_strategyname =xfer_tile_payout_strategyname
            
      #resp_dict =dict(tile=tile_target)
      resp_json =pyppa.json_ez.json.toJson(tile_target)
      resp =flask.make_response((resp_json,200,{'Content-Type':'text/plain'}))
      
  except:
    errmsg ='exception in rest_tile_tileid_patch'
    logging.exception(errmsg)
    resp_dict =dict( errmsg = errmsg)
    resp_json =pyppa.json_ez.json.toJson(resp_dict)
    resp =flask.make_response((resp_json, 200, {'Content-Type':'text/plain'}))
  
  return resp

class Object(object):
  pass
def rest_all_player_get(request):
  resp =None
  try:
    dao =lilogame.registry.get_dao()
    gameroom =dao.get_gameroom()
    players =dao.get_players()
    players_xfer =len(players)*[None]
    
    for idx in xrange(0, len(players)):
      p =players[idx]
      pxfer =dict(u=p.u, cash=p.cash, dollars=p.dollars, tenthouths=p.tenthouths, id=p.id)
      players_xfer[idx] =pxfer
      
    resp_dict =dict(gameroom=gameroom, players=players_xfer)
    resp_json =pyppa.json_ez.json.toJson(resp_dict)
    resp =flask.make_response((resp_json,200,{'Content-Type':'text/plain'}))
  except:
    errmsg ='exception in rest_tile_tileid_patch'
    logging.exception(errmsg)
    resp_dict =dict( errmsg = errmsg)
    resp_json =pyppa.json_ez.json.toJson(resp_dict)
    resp =flask.make_response((resp_json, 200, {'Content-Type':'text/plain'}))
  
  return resp  

def rest_kick_all_player_get(request):
  resp =None
  
  try:
    if not _is_valid_spinner_session( request ):
      resp_dict =dict(errmsg="not authorized to rest_tile_tileid_patch")
      resp_json =pyppa.json_ez.json.toJson(resp_dict)
      resp =flask.make_response((resp_json,200,{'Content-Type':'text/plain'}))
    else:  
      dao =lilogame.registry.get_dao()
      with dao.spinner_lock:
        dao.ary_player =[]
        
        for tile in dao.tiles:
          tile.n_population =0
          
        dao.gameroom.round =0
        
      resp_dict =dict(msg ='ok reset complete')
      resp_json =pyppa.json_ez.json.toJson(resp_dict)
      resp =flask.make_response((resp_json,200,{'Content-Type':'text/plain'}))
  except:
    errmsg ='exception in rest_tile_tileid_patch'
    logging.exception(errmsg)
    resp_dict =dict( errmsg = errmsg)
    resp_json =pyppa.json_ez.json.toJson(resp_dict)
    resp =flask.make_response((resp_json, 200, {'Content-Type':'text/plain'}))
    
  return resp
      