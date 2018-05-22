import flask
import pw.pw_util
import lilogame.webworker
import traceback
import os

def compute_root_path( ):
  this_dir =os.path.dirname( os.path.abspath(__file__) )
  root_path =os.path.abspath( os.path.join( this_dir, '..') )
  
  return root_path

def create_flask_app( ):
  print('__name__ =',__name__)
  #app =flask.Flask(import_name='lilogame') #, instance_relative_config=True, static_folder='static')
  #app = flask.Flask(__name__, instance_relative_config=True, static_folder='static', static_url_path='/../static')
  #app =flask.Flask('work', instance_path='/home/kurt5/pyprog/pw/koi-proto/src/', static_folder='static', static_url_path='/../static')
  
  root_path=compute_root_path()
  app =flask.Flask('run_lilogame', root_path=root_path)
  app.config['TESTING'] = True
  app.config['SECRET_KEY'] =b'5890askd9FAK!()#'
  
  with app.app_context():
    @app.route('/smoke/')
    def smoke():
      s_resp ="""
              <html><body>
                <h1>Hello from appname =%s</h1>
                <h2>You should not use the default app - but it`s a good smoke-test</h2>
              </body></html>""" % (app.name)
      resp =flask.make_response((s_resp, 200, {"Content-Type":"text/html"})) # content:string, return_code:int, headers:dict<string,string>
      return resp

    #end-sub 'index_html()'
    
    @app.route('/')
    def root():
      resp =None
      try:
        resp = flask.redirect( flask.url_for('static_lilogame_login_html'))
      except:
        traceback.print_exc()
      return resp
    
    @app.route('/')
    @app.route('/index.html')
    @app.route('/login.html')
    @app.route('/static/lilogame/')
    @app.route('/static/lilogame/login.html')
    def static_lilogame_login_html():
      resp =None
      try:
        resp = app.send_static_file('lilogame/login.html')
      except:
        traceback.print_exc()
      return resp
    
    
    @app.route('/static/lilogame/gamboard.html')
    def static_lilogame_gameboard_html():
      resp =app.send_static_file('lilogame/gameboard.html')
      
      return resp
      
    @app.route('/static/lilogame/spinner.html')
    def static_lilogame_spinner_html():
      resp =app.send_static_file('lilogame/spinner.html')
      
      return resp    
    
    @app.route('/static/lilogame/spinner.html')
    def static_lilogame_login_spinner_html():
      resp =app.send_static_file('lilogame/login-spinner.html')
      
      return resp
    
    @app.route('/rest/spinnerauthn/',methods=['GET','POST'])
    def rest_spinnerauthn(): 
      resp =lilogame.webworker.lilogame_spinnerauthn( flask.request )
      return resp
    
    @app.route('/rest/playerauthn/',methods=['GET','POST'])
    def rest_playerauthn():
      """
        request.get
        on error, send player to lilogame/login.html
        on success, send player to lilogame/gameboard.html?s={sessid}&u={username}
      """
      resp =lilogame.webworker.lilogame_playerauthn( flask.request )
      return resp

    @app.route('/rest/gameroom/', methods=['GET'])
    def rest_gameroom():
      resp =lilogame.webworker.rest_gameroom_get(flask.request)
      return resp
        
    @app.route('/rest/spinner/spin/', methods=['GET','POST','PUT'])
    def rest_spinner_spin():
      resp =lilogame.webworker.rest_spinner_spin( flask.request )
      return resp
    
    @app.route('/rest/currenttile/playerid/<playerid>/tileid/<tileid>/', methods=['GET','POST'])
    def rest_currenttile_player_tile(playerid, tileid):
      resp =lilogame.webworker.rest_currenttile_player_tile( flask.request, playerid, tileid )
      return resp
    
    
    @app.route('/rest/gameroom/player/', methods=['GET'])
    def rest_gameroom_player():
      resp =lilogame.webworker.rest_gameroom_player( flask.request )
      return resp
    
    @app.route('/rest/new/game/')
    def rest_new_game():
      resp =None #@TODO IMPLEMENT
      return resp
    
    @app.route('/rest/reset_all_player_cash/')
    def rest_reset_all_player_cash():
      resp =lilogame.webworker.rest_reset_all_player_cash(flask.request) 
      return resp
    
    @app.route('/rest/reset_round_counter/')
    def rest_reset_round_counter():
      resp =lilogame.webworker.rest_reset_round_counter(flask.request)
      return resp
    
  return app  
#end-def apply_routes_base  

app =create_flask_app()

