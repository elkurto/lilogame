import sys
from pyppa.webhelp.webserver import TornadoServer, Appfactory_Default, fn_after_request
import lilogame.app





def extract_port_from_args( argv , default_port=5000):
  i_port =default_port
  for arg in argv:
    if arg.startswith('port='):
      s_port =arg[len('port='):]
      try:
        i_port =long(s_port)
      except:
        raise Exception('bad arg : non-numeric port number specified :: ({0})'.format(s_port))
      
  return i_port
 
def main(argv=[]):
  print('__name__',__name__)
  # 1. make a flask app
  app =lilogame.app.app
  #app.after_request(fn_after_request) # only cache images - disable cache for non-image mimetypes
    
  # 2. make a webserver from app
  i_port =extract_port_from_args( argv, default_port=5000 )
  tornadoServer =TornadoServer.newInstanceFromApp(app=app,port=5000)
  
  # 3. install signal handler to process Ctrl+C
  tornadoServer.connect_signal_handler(  )
  
  # 4. start the webserver thread
  tornadoServer.start()  # now visit http://localhost:5000/
  
  # 5. Main-thread lingers until :child-thread:tornadoServer completes.
  try:
    while tornadoServer.isAlive():
      # IF tornadoServer-thread is alive, THEN main-thread waits 1 sec 
      # ELSE cease loop and quit
      tornadoServer.join(1)   
    #end-while
  except IOError:
    pass # on windows threads raise IOError`s when interrupted.
    #    # on linux this try-except block is unnecessary.
         
if __name__ == '__main__':
  argv =sys.argv
  main(argv)