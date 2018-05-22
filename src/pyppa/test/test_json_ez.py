import unittest
import pw.pw_util
from pyppa.json_ez import json


class Foo(object):
  
  def __init__(self):
    self.a ='b'
    self.c ='d'
    self.e =1
    self.f =[12,34]


class Test(unittest.TestCase):
  
  def test_toJson(self):
    actual =json.toJson(1)
    self.assertEqual(actual, str(1), "should be 1")
    
    actual =json.toJson(1.123)
    self.assertEqual(actual, str(1.123), "should be 1.123")
    
    actual =json.toJson("booger")
    self.assertEqual(actual, '"booger"', "should be \"booger\"")
    
    actual =json.toJson(True)
    self.assertEqual(actual, 'true', "should be true")
    
    actual =json.toJson(False)
    self.assertEqual(actual, 'false', "should be false")
    
    actual =json.toJson(None)
    self.assertEqual(actual, 'null', "should be null")
    
    actual =json.toJson([1,2,3,4])
    self.assertEqual(actual, '[1,2,3,4]', "should be [1,2,3,4]")
    
    actual =json.toJson({"a":"b","c":"d","e":1,"f":[12,34]})
    expected ='{"a":"b","c":"d","e":1,"f":[12,34]}'
    self.assertEqual(actual,expected, "actual ={0} ::: expected ={1}".format(str(actual),str(expected)))
    
    actual =json.toJson(Foo())
    expected ='{"a":"b","c":"d","e":1,"f":[12,34]}'
    self.assertEqual(actual,expected, "actual ={0} ::: expected ={1}".format(str(actual),str(expected)))
  #end-def
  
  def test_fromJsonToObject(self):
    s_json ='{"proposal":{"id":1014,"title":"20160706T1342","description":"20160706T1342","proposer_id":null,"proposer":{"modified_ms":1467738378628,"surname":"Buehner","modified_by":"m315468","enabled":1,"clockid":"m111111","email":"kurt.buehner@pw.utc.com","ldapuid":"m111111","givenname":"Kurt","id":1},"bizownerid":1001,"itownerid":1001,"execownerid":1001,"bizowner":{"modified_ms":1468442470497,"surname":"Buehner","modified_by":"m315468","enabled":1,"clockid":"315468","email":"Kurt.Buehner@pw.utc.com","ldapuid":"m315468","givenname":"Kurt","id":1001},"itowner":{"modified_ms":1468442470497,"surname":"Buehner","modified_by":"m315468","enabled":1,"clockid":"315468","email":"Kurt.Buehner@pw.utc.com","ldapuid":"m315468","givenname":"Kurt","id":1001},"execowner":{"modified_ms":1468442470497,"surname":"Buehner","modified_by":"m315468","enabled":1,"clockid":"315468","email":"Kurt.Buehner@pw.utc.com","ldapuid":"m315468","givenname":"Kurt","id":1001},"docid_mandate":1029,"doc_mandate":{"modified_by":"aaa","filename":"a.sql","content":null,"sizebytes":7994,"mime":"application/octet-stream","modified_ms":1467827332703,"id":1029},"b_01_originated":false,"b_02_proposed":false,"b_03a1_notifiedbo":false,"b_03b1_notifiedit":false,"s_03a2_dispo_bo":null,"s_03b2_dispo_it":null,"b_04_reviewed":false,"b_05_notifiedeo":false,"s_06_dispo_eo":null,"b_07_completed":false,"b_99_promoted":false,"b_is_current_user_itowner":true,"modified_by":"aaa","comment_bizowner":null,"comment_execowner":null,"proposerid":1,"modified_ms":1467827333043,"b_is_current_user_bizowner":true,"comment_itowner":null,"b_is_current_user_execowner":true},"proposalid":1014,"dispo":"accepted","role":"bizowner","msg":""}'
    o =json.fromJson(s_json,pw.pw_util.Object,True)
    self.assertNotEquals( o, None)
    self.assertEquals( o.role, 'bizowner')
    self.assertEquals( o.dispo, 'accepted')
    self.assertEquals( o.proposalid, 1014 )
  #end-def
    
  def test_toJson002(self):
    obj =pw.pw_util.Object()
    obj.a =pw.pw_util.Object()
    obj.a.a ="&*|<>'\"!/?_"
    obj.a.b =u"&*|<>'\"!/?_"
    
    s_actual =json.toJson(obj)
    print "s_acutal =" + s_actual
    obj_reconstituted =json.fromJsonToObject(s_actual)
    self.assertNotEquals(obj_reconstituted, None)
    self.assertEquals(obj_reconstituted.a.a, obj.a.a)
    self.assertEquals(obj_reconstituted.a.b, obj.a.b)
    
  #end-def
    
  def test_fromJson(self):
    string_in ='{"a":"b","c":"d","e":1,"f":[12,34]}'
    actual_foo =json.fromJson(string_in, Foo)
    
    self.assertEqual(actual_foo.a, 'b')
    self.assertEqual(actual_foo.c, 'd')
    self.assertEqual(actual_foo.e, 1)
    self.assertEqual(actual_foo.f[0], 12)
    self.assertEqual(actual_foo.f[1], 34)

  
  def test_fromJson_2(self):
    string_in ='{"projid":40,"status":"started","description":"asdfa","nthiter":null,"startdate_yyyymmdd":"2017-02-20","enddate_yyyymmdd":"2017-02-28"}'
    o =json.fromJsonToObject(string_in)
    self.assertEquals( 40, o.projid)
    
  def test_cp1252_decode(self):
    string_in =chr(0xe2).decode('cp1252').encode('utf8')
    print(string_in)
    
if __name__ == "__main__":
    #import sys;sys.argv = ['', 'Test.testName']
    unittest.main()