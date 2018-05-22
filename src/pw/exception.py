
import unittest
import logging
logging.basicConfig(format='%(levelname)s:%(asctime)s:%(filename)s:%(funcName)s():%(lineno)d - %(message)s', level=logging.DEBUG)

class PwAppException(Exception):
	def __init__(self,value,b_logged=False,errmsg=None):
		super(PwAppException,self).__init__(value)
		self.value =value
		self.b_logged =False # a flag that indicates if this exception was logged
		self.errmsg =value if errmsg is None else errmsg # a displayable error message
	
	def __repr__(self):
		return str(self.value)
	def __str__(self):
		return str(self.value)
	#end-ctor
#end-class 'PwAppException'
	
class PwAppException_Authz(PwAppException):
	pass


class Test(unittest.TestCase):
	def test_PwAppException_Authz(self):
		try:
			raise PwAppException_Authz('i am not authorized to xyz',b_logged=False)
		except PwAppException_Authz as exc:
			self.assertTrue( isinstance(exc, PwAppException_Authz))
		except:
			self.fail('did not raise the excpected exception')
			
if __name__ == "__main__":
	unittest.main()	
			
					
		
