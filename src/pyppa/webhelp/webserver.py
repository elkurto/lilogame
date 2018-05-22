from flask import Flask, make_response #request, Response, 

#import pw.configobjx
#import pw.registry
import logging


from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop

import time 
import signal 

import threading

import pyppa.json_ez
import flask


	

def create_resp_json( oresp_entity ):
	s_resp =pyppa.json_ez.json.toJson(oresp_entity)
	resp =flask.Response(s_resp, 200, {'Content-Type':'text/json'})
	return resp

class AppFactory(object):
	def __init__(self):
		pass
	
	def create_flask_app(self):
		return None

#end-class AppFactory(object)	

class Appfactory_Default(AppFactory):
	"""
		If you`re reading this know that Appfactory_Default 
	"""
	def __init__(self):
		super(self.__class__,self)
		
	def create_flask_app(self,appname):
		
		app =Flask(appname, instance_relative_config=True, static_folder='static')
		
		@app.route('/')
		@app.route('/index.html')
		#@requires_auth
		def index_html():
			s_resp ="""
							<html><body>
								<h1>Hello from appname =%s</h1>
								<h2>You should not use the default app - but it`s a good smoke-test</h2>
							</body></html>""" % (appname)
			resp =make_response((s_resp, 200, {"Content-Type":"text/html"})) # content:string, return_code:int, headers:dict<string,string>
			return resp

		#end-sub 'index_html()'
				
		return app
#end-Appfactory_Default


def fn_after_request(resp):
	
	#logging.debug('resp.mimetype ={0}'.format(getattr(resp,'mimetype')))
	if getattr(resp,'mimetype',None) == 'image/svg+xml':
		pass
	elif resp is not None and hasattr(resp,'headers') :
		""" Turn off caching! for non-svg-files"""
		resp.headers.set('If-Modified-Since', 'Sat, 29 Oct 1994 19:43:31 GMT')
		resp.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
		resp.headers.set('Pragma','private')
	return resp
#end-def

def connect_signal_handler( tornadoServer ):
	print("connected handler")
	def signal_handler(signal, frame):
		print('You pressed Ctrl+C!')
		global b_running
		b_running = False
		tornadoServer.cease()
		time.sleep(1)
		
		print "b_running =%s ::: pippaServer.b_running =%s" % (str(b_running), str(tornadoServer.b_running))
		# sys.exit(0)
	
	signal.signal(signal.SIGTERM , signal_handler)					
	signal.signal(signal.SIGINT , signal_handler)
	
	
	return signal_handler

#end-def connect_signal_handler

class TornadoServer(threading.Thread):
	
	def __init__(self):
		threading.Thread.__init__(self)
		self.port =5000
		self.app =None
		self.httpserver =None
		self.b_running =False
		
	@staticmethod
	def newInstanceFromApp(app=None,port=5000):
		tornadoServer =TornadoServer()
		tornadoServer.port =port
		tornadoServer.app =app
		return tornadoServer
	
	def connect_signal_handler( self ):
		print("connected handler")
		def signal_handler(signal, frame):
			print('You pressed Ctrl+C!')
			global b_running
			b_running = False
			self.cease()
			time.sleep(1)
			#print "b_running =%s ::: pippaServer.b_running =%s" % (str(b_running), str(self.b_running))

		signal.signal(signal.SIGTERM , signal_handler)					
		signal.signal(signal.SIGINT , signal_handler)
		
		
		return signal_handler
	
	#end-def connect_signal_handler
	
	
	def cease(self):
		self.b_running =False
		if self.httpserver != None:
			IOLoop.instance().stop()
			self.httpserver.stop()
			
		return
	#end-sub 'cease()'
	
	def isAlive(self):
		return self.b_running
	
	def run(self):
		self.b_running =True
		print "starting"
		logging.info("starting")
		#self.httpserver = HTTPServer(WSGIContainer(self.app),ssl_options={
		#		"certfile": "key/key.crt",
		#		"keyfile": "key/key.key",
		#})
		self.print_routes(self.app)
		self.app.after_request(fn_after_request)
		self.httpserver = HTTPServer(WSGIContainer(self.app))
		
		self.httpserver.listen(self.port)
		print "started"
		logging.info('started')
		IOLoop.instance().start()
		
		logging.info("...Exited")
	#end-sub 'run(self)'
	
	def print_routes(self, app):
		import urllib
		
		with app.app_context():
			#app.config['SERVER_NAME'] ='127.0.0.1'
			output = []
			for rule in app.url_map.iter_rules():
					
					options = {}
					for arg in rule.arguments:
							options[arg] = "[{0}]".format(arg)
	
					methods = ','.join(rule.methods)
					#url = flask.url_for(rule.endpoint, **options)
					#line = urllib.unquote("{:50s} {:20s} {}".format(rule.endpoint, methods, url))
					line = urllib.unquote("{:50s} {:20s} ".format(rule.endpoint, methods))
					output.append(line)
			
			for line in sorted(output):
				print line
			
#end-class 'TornadoServer'

