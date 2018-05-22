import types
import json as json_difficult
import pw.pw_util
import sys


class json(object):
	
	def __init__(self, params):
			'''
			Constructor
			'''
	
	@classmethod
	def dictentryToJson(cls,key,dictionary):
		val =dictionary[key]
		rval =None
		rval ='"{0}":{1}'.format(key, cls.toJson(val))
		return rval
	
			
	@classmethod
	def escapeJson(cls, s=None):
		if not hasattr(s,'replace'):
			return s
		
		if ( s == None ):
			return None
		
		# replace " with \"
		try:
			s =s.decode('cp1252').encode('utf8')
		except:
			pass
		s =s.replace("\\", "\\\\")	# reverse-solidus
		s =s.replace("\"", "\\\"")	# quotation mark
		s =s.replace('/','\\/')		 # solidus
		s =s.replace(chr(10),'\\n') # newline
		s =s.replace(chr(13),'\\r') # carriage return
		s =s.replace(chr(9),'\\t')	# tab
		s =s.replace(chr(12),'\\f') # form feed 
		
		return s
	
	
	@classmethod
	def toJson(cls, obj=None):
		"""
			@param obj :object any object that caller wants to serialize to json string
			@return :string the json-string representation of obj
			
			@TODO: handle tuple --- treat tuple like an array
		"""	
		if ( obj == None ):
			return "null"

		elif ( isinstance(obj,bool) ):
			return ("true" if obj else "false")
				
		elif ( isinstance(obj,int) ):
			return str(obj)

		elif ( isinstance(obj,long) ):
			return str(obj)
				
		elif ( isinstance(obj,str) or isinstance(obj,unicode)):
			return '"'+cls.escapeJson(obj)+'"'
		
		elif ( isinstance(obj,float) ):
			return str(obj)
		
		elif ( isinstance(obj,list) ):
			return "[" + ','.join(map(lambda x: cls.toJson(x), obj)) + "]"
		
		elif ( isinstance(obj,dict) ):
			return "{" + ",".join(map( lambda key: cls.dictentryToJson(key,obj), obj.keys() )	) + "}"
						
		elif ( isinstance(obj,object) ):
			dictionary =obj.__dict__
			return cls.toJson(dictionary)
		
		else:
			raise Exception('unsupported type	::: '+type(obj))
		
		
		return ""

	@classmethod
	def fromJsonToObject(cls, s_json):
		obj =json_difficult.loads(s_json)
		
		rval =cls._convertValueRecursively(obj)
			
		return rval 
	
	#end-def
	
	@classmethod 
	def _convertValueRecursively(cls,obj):
		rval =None
		if isinstance(obj,dict):
			rval =pw.pw_util.Object()
			for key in obj:
				setattr( rval, key, cls._convertValueRecursively( obj[key] ) )
			#end-for-i
		elif isinstance(obj, list):
			rval =list()
			for i in xrange(0,len(obj)):
				rval.append( cls._convertValueRecursively( obj[i] ) )
			#end-for-i
		else:
			rval =obj
		#end-if
		
		return rval
		
	@classmethod
	def fromJson(cls,s_json,clazz=None,b_create_fields=False):
		"""
		@param clazz:Class - a type (class) that you want to instantiate
		@param string:str - a string of json that will be interpreted into an instance of clazz:Class
		"""
		rval =None
		obj	=json_difficult.loads(s_json)
		
		if ( isinstance(obj,dict)):
			rval =clazz() if clazz is not None else dict()
			cls._fromJson_dict(obj,rval,b_create_fields)
			
		elif( isinstance(obj,list)):
			rval =clazz() if clazz is not None else list()
			cls._fromJson_list(obj,rval,b_create_fields)
			
		elif( isinstance(None,obj)):
			rval =None
			
		return rval 
		
	@classmethod		
	def _fromJson_list(cls, olist, odest, b_create_fields ):
		if ( isinstance(odest,list)):
			map( odest.append, olist)
			# @TODO: recursively populate sub-fields as objects
		else:
			raise Exception('type mismatch type(odest) ={0} ::: expected list'.format(type(odest)))
				
		return
			
	@classmethod
	def _fromJson_dict(cls, odict, odest, b_create_fields):
		if ( isinstance(odest,dict) ):
			
			for key in odict:
				odest[key] =odict[key]
				
		elif ( isinstance(odest,object)):
			
			for key in odict.keys():
				val =odict[key]
				
				if ( b_create_fields or hasattr(odest, key) ):	# if the destination field exists, then assign value to it.
					setattr(odest, key,val)
					# @TODO: use decorators on setter-methods to enforce types of fields
					# @TODO: recursively populate fields.
		else: 
			raise Exception('type mismatch type(odest) ={0} ::: expected dict or object'.format(type(odest)))
		
		return
	
"""
callable(somefn) -> True
callable(1) -> False

type(int) == type(1)	-> True
type(str) == type('123') -> True
type(dict)	== type({}) ->True
type(list)	== type([]) ->True
type(NoneType)	== type(None) ->True

>>> class D(object):
...	 def __init__(self):
...		 self.a =1
...		 self.b =2
...		 self.s ='abc'
...
...	 def fna(self):
...		 return 1
...
>>> d =D()
>>> type(d)
<class '__main__.D'>
>>> d.__dict__
{'a': 1, 's': 'abc', 'b': 2}
>>> dir(d)
['__class__', '__delattr__', '__dict__', '__doc__', '__format__', '__getattribute__'
, '__hash__', '__init__', '__module__', '__new__', '__reduce__', '__reduce_ex__'
, '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__'
, '__weakref__', 'a', 'b', 'fna', 's']

"""
