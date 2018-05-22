import time
import random
import logging
from operator import isNumberType
import math

import socket
import subprocess
import re
import os
import io
import datetime
import pytz 
import bisect # function is_key_in_sorted_list uses bisect.bisect_right		
import pw.exception 
import numbers

class Object(object):
	def __init__(self,*arg,**kwarg):
		super(Object, self).__init__()
		
		for key in kwarg:                 # 2. store each kw in kwarg:dict as an attribute of the instance of subtype of AssetType 
			setattr(self, key, kwarg[key])		
	# end-ctor
# end-class

def enjoin(sep='', *args, **kwargs):
	return sep.join(map(lambda a :str(a), args))

def concat(*args):
	return ''.join([str(x) for x in args])

def has_method(otarget, s_methodname):
	"""
	@param otarget:object
	@param s_methodname:str - name of a method
	@return :bool	if method exists on {{object}} otarget, then return True
								 otherwise return False 
	"""
	if (otarget == None): 
		return False
	
	method = getattr(otarget, s_methodname, None)
	return (method != None and callable(method))

def enlist(*args):
	"""
		@param: *args : tuple<Any>
		@return: :list	compose a list of elements in param-list, *args
	"""
	return [x for x in args]	# i.e. map( lambda x: x, args)

def entuple(*args):
	"""
		@param: *args : tuple<Any>
		@return: :tuple	return elements of param, *args, a tuple
		e.g. pu_util.entuple(1,2,3,'a','b','c') // returns	(1,2,3,'a','b','c')
	"""	
	return args
# end-def entuple

def endict(**kwargs ):
	"""
	  Make a dictionary from keyword arguments
	"""
	return kwargs

def now_ms():
	return long(time.time() * 1000)
# end-def 'now_ms()'

def use_ms_or_now( ms):
	if ms is None:
		ms =now_ms()
	return ms


def has_match(function, olist):
	if olist is None or len(olist) == 0:
		return False
	
	rval_has_match =False
	for o in olist:
		if function( o ):
			rval_has_match =True
			break
	
	return rval_has_match

def first(function, olist, default_value=None):
	""" 
	    @param function  - a function/lambda that takes elements of olist
	    @param olist     - list over-which this function iterates 
	    @param default_value  - something to return if no matches
	    
			@return rval_first_match - an element of olist -
			            The left-most element in olist where function(element) == True
	"""
	if olist is None:
		return None
	
	rval_first_match =None
	for o in olist:
		if function( o ):
			rval_first_match =o
			break
	
	return rval_first_match

random.seed(long(now_ms()))
def create_uuid_negative(max_magnitude=1000000000L):
	return long(random.random() * max_magnitude) * -1
# end-def 'create_uuid_negative'	

def convertToBool(value):
	b_rval = False
	if value == None:
		b_rval = False
	elif value == 1:
		b_rval = True
	elif value == '1':
		b_rval = True
	else:
		b_rval = False
		
	return b_rval
# end-def 'convertToBool'

def ensure_attr(obj, attrname, default_value):
	"""
	If hasattr(obj, attrname) Then do nothing
	Otherwise setattr(obj, attrname, default_value)
	What`s the point -- ensure invariant and avoid exceptions for missing fields.
	"""
	if not hasattr(obj, attrname):
		setattr(obj, attrname, default_value)
	

def setattr_on_obj(s_keypath, obj, value):
	"""
	At the path specified by param, keypath, set the attribute on param, obj
	with param, value.  If keypath does not exist in obj, then create the keypath
	@param keypath :str  a string that specifies the field to set.
	@param obj :object  a plain old Python object
	@param value :anything  the value to bind to obj[ keypath ]
	
	@return obj :object -same as the param
	@post object[ keypath ] == value
	
	e.g.   obj =pw.pw_util.setattr_on_obj('a.b.c', pw.pw_util.Object(), 123)
	#      #now,  obj.a.b.c =123 
	"""
	alist_fieldname_subkeypath = s_keypath.split('.', 1)
	obj = obj if obj != None else Object()
	
	if (len(alist_fieldname_subkeypath) >= 2):
		fieldname = alist_fieldname_subkeypath[0]
		subkeypath = alist_fieldname_subkeypath[1]
		
		if not hasattr(obj, fieldname) or getattr(obj, fieldname) == None:
			setattr(obj, fieldname, Object())
		
		setattr_on_obj(subkeypath, getattr(obj, fieldname), value)
	
	elif (len(alist_fieldname_subkeypath) >= 1):
		
		fieldname = alist_fieldname_subkeypath[0]
		setattr(obj, fieldname, value)
	
	return obj

def long_to_str(ilong):
	s_digits = None
	
	if ilong == None:
		s_digits = None
	elif isinstance(ilong, str):
		s_digits = ilong
	elif isNumberType(ilong):
		s_digits = "{:d}".format(long(ilong))
		
	return s_digits
# end-def long_to_string



def long_val(s, default_value=None):
	i_rval = default_value
	try:
		i_rval = long(s)
	except:
		pass
	
	return i_rval
#end-def 

longval =long_val

def int_val(s, default_value=None):
	i_rval = default_value
	try:
		i_rval = int(s)
	except:
		pass
	
	return i_rval
#end-def 
intval =int_val

	
def close(closable=None):
	"""
		@param: closeable
		@postcondition: invoke close on the object, {{param}} closeable.
		@return: void
		@note: no throw
	"""
	if (closable != None):
		if (getattr(closable, 'close', None) != None and callable(closable.close)):
			try:
				closable.close()
			except:
				pass
	return
# end-def 'close()'

def rollback(rollbackable=None):
	"""
		@param: rollbackable
		@postcondition: invoke rollback on the object, {{param}} rollbackable.
		@return: void
		@note:	no throw
	"""
	if (rollbackable != None):
		if (getattr(rollbackable, 'rollback', None) != None and callable(rollbackable.rollback)):
			try:
				rollbackable.rollback()
			except:
				pass
	return
# end-def 'close()'

def shallow_copy_list(olist):
	""" shallow-copies list like data objects """
	if olist is None:
		return []
	# end-if
	
	olist_rval = olist[:]
	return olist_rval;
# end-def 'shallow_copy_list(..)'
	
def shallow_copy_dict(odict):
	""" shallow-copies dictionary like data objects without weird exceptions that obj.copy() raises """
	
	if odict is None:
		return {}
	# end-if
	
	odict_rval = {}
	for key in odict.keys():
		odict_rval[key] = odict[key]
	# end-for 'key'
	
	return odict_rval
# end-def 'shallow_copy_dict(..)'

def shallow_copy_headers(headers):
	if headers is None:
		return {}
	
	odict_rval = {}
	for key in headers.keys():
		if not odict_rval.has_key(key):
			odict_rval[key] = []
			
		olist = enlist(*(headers[key]))
		odict_rval[key].append(olist)
	# end-foreach-key
	
	return odict_rval
# end-def

def isintegral( val ):
	b_isintegral =isinstance(val, numbers.Integral)
	return b_isintegral

pattern_is_nat = re.compile('^\d+$')
def is_nat(s):
	if s == None: 
		return False
	
	if isintegral( s ):
		b_is_nat = (s >= 0)
		
	else:
		s_str =str(s)
		b_is_nat =False
		try:
			b_is_nat = (pattern_is_nat.match(s_str) != None)
		except:
			pass
		
	return b_is_nat
# end-def 'is_nat(s)'
isnat =is_nat





def gethostname():
	s_hostname = socket.gethostname()
	s_output = subprocess.check_output(['nslookup', s_hostname])
	omatchresult = re.search('Name:\s+(\S+)\s', s_output, re.M)
	
	s_fully_qualified_hostname = None
	if omatchresult is not None:
		tuple_group = omatchresult.groups()
		if tuple_group is not None and len(tuple_group) > 0:
			s_fully_qualified_hostname = tuple_group[0]	 
		# end-if
	# end-if
	
	return s_fully_qualified_hostname
# end-def	



def is_list_or_tuple_or_buffer(x):
	b_is_indexed_type =(  isinstance( x, list )
										 or isinstance( x, tuple )
										 or isinstance( x, buffer )
										 )
	return b_is_indexed_type

def shallow_copy_named_fields(olist_fieldname=[],osrc=None,odest=None):
	''' 
		Copy field into odest iff (a) the field is named in olist_fieldname 
		and (b) the field exists in osrc.
		 
		@param olist_fieldname :List<str> - a list of field names to 
	            copy from osrc:pw.pw_util.Object to odest:pw.pw_util.Object
	    
	    @param  osrc :pw.pw_util.Object   - source object
	    
	    @param  odest :pw.pw_util.Object  - destination object
	'''
	if odest is None:
		odest =Object()
		
	for fieldname in olist_fieldname:
		if hasattr(osrc, fieldname):
			value =getattr(osrc,fieldname)
			setattr(odest,fieldname,value)
	
	return odest

class RequestVo(object):
	def __init__(self):
		self.cookies = {}
		self.values = {}
		self.headers = {}
		self.args ={}
		self.data = None
		self.base_url = None
		
	# end-ctor
	
	@staticmethod
	def create_from_request(request):
		"""
		 @param request 
		 @see http://werkzeug.pocoo.org/docs/0.11/wrappers/ for a description of the object request
		"""
		requestvo = RequestVo()
		
		requestvo.cookies = shallow_copy_dict(request.cookies)
		requestvo.values = shallow_copy_dict(request.values)
		requestvo.header = shallow_copy_headers(request.headers)	
		requestvo.args = request.args
		# requestvo.header =request.headers	# an instance of werkzeug.datastructures.EnvironHeaders ::: 
		#																	# @see "C:\Python27\lib\site-packages\werkzeug\datastructures.py", line 1300
		#																	# a jacked-up hard to copy data-structure
		#																	#@TODO deepcopy headers to avoid raw instance of EnvironHeaders
		requestvo.method = request.method
		request.get_data()
		requestvo.data = request.data 
		requestvo.base_url = request.base_url
		requestvo.url = request.url
		requestvo.files = shallow_copy_dict(request.files)
		
		requestvo.username = None
		if requestvo.cookies is not None and requestvo.cookies.has_key('username') :
			requestvo.username = requestvo.cookies['username'] 
		# end-if
		
		return requestvo
	# end-def
	
# end-class RequestVo
# may need to see URL : http://werkzeug.pocoo.org/docs/0.11/datastructures/	class werkzeug.datastructures.Headers
def add_headers_nocache(resp):
	if resp is not None and hasattr(resp, 'headers') :
		resp.headers.set('If-Modified-Since', '0')
		resp.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
		resp.headers.set('Pragma', 'private')
	
	return resp
# end-def
def add_headers_html_nocache(resp):
	if resp is not None and hasattr(resp, 'headers') :
		resp.headers.set('If-Modified-Since', '0')
		resp.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
		resp.headers.set('Pragma', 'private')
		resp.headers.set('Content-Type', 'text/html')		
	
	return resp
# end-def
def add_headers_json_nocache(resp):
	if resp is not None and hasattr(resp, 'headers') :
		resp.headers.set('If-Modified-Since', '0')
		resp.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
		resp.headers.set('Pragma', 'private')
		resp.headers.set('Content-Type', 'text/plain')		
	
	return resp
# end-def	

def escapeHtml(s):
	if s is None:
		return ''
	
	s = s.replace('&' , '&amp;')
	s = s.replace('\'', '&apos;')
	s = s.replace('"' , '&quot;')
	s = s.replace('>' , '&gt;')
	s = s.replace('<' , '&lt;')
	
	return s
# end-def

def escapeStringOracle(s):
	if s is None:
		return ''
	
	s = s.replace('\'', '\'\'')
	s = s.replace('&', '\'||\'&\'||\'')
	
	
	return s
	
def encode_to_ascii(s):
	if s is None:
		return s
	if has_method(s, 'encode'):
		return s.encode('ascii','replace')
	
	return s
		

def is_key_in_sorted_list(a, key):
	i_index =bisect.bisect_right(a, key) -1
	b_found =(i_index > -1 and a[i_index] == key)
	
	return b_found		

def epoch_to_yyyymmdd(epochtime, unit='ms'):
	if epochtime is None:
		return None
	
	i_epochtime =long_val(epochtime, default_value=0)
	if unit == 'ms':
		i_epochtime =i_epochtime/1000
	elif unit == 's':
		pass
	
	s_yyyy_mm_dd =None
	
	s_yyyy_mm_dd =datetime.datetime.fromtimestamp( i_epochtime, pytz.utc ).strftime('%Y-%m-%d')
	
		
	
	return s_yyyy_mm_dd

#@TODO: test
def convert_list_rec_to_dict(olist_of_rec,fieldname_key,allow_key_none=False):
	odict_rval =dict()
	for rec in olist_of_rec:
		key_value =getattr(rec,fieldname_key,None)
		
		if key_value is None and not allow_key_none:
			continue
		
		if not odict_rval.has_key(key_value):
			odict_rval[key_value] =[]
			
		odict_rval[key_value].append(rec)
	#end-rec
	
	return odict_rval	
#end-def

def binary_search(ao_sorted, fn_cmp, key, lo=None, hi=None):
	hi =len(ao_sorted)-1 if hi is None else hi
	lo =0 if lo is None else lo
	
	index_target =None
	elem_target =None
	while lo <= hi and index_target is None:
		midpoint =(lo+hi)/2 
		
		i_cmp =fn_cmp(key, ao_sorted[midpoint])
		if i_cmp == 0:
			index_target =midpoint
			elem_target =ao_sorted[midpoint]
		else:
			if i_cmp < 0:
				hi =midpoint -1
			else: #if i_cmp > 0:
				lo =midpoint +1
				
	return (index_target,elem_target)
		