import unittest
import lilogame.registry
import lilogame.webworker
import lilogame.test.mock

class Test_Webworker(unittest.TestCase):

  def test_rest_spinner_spin__smoketest(self):
    # setup
    registry =lilogame.registry.Registry.reset()
    registry.config.fn_random =lambda : 1   # high fn_random to always win
    request =lilogame.test.mock.Request()
    authn =lilogame.registry.get_authn()
    request.cookie['ss'] =authn.spinner.sessionid
    
    # 
    b_rval =lilogame.webworker._rest_spinner_spin(request)
    self.assertEqual( b_rval , True )
    
  def test_rest_spinner_spin__test_with_players__always_win(self):
    # setup
    registry =lilogame.registry.Registry.reset()
    registry.config.fn_random =lambda : 1   # high fn_random to always win
    request =lilogame.test.mock.Request()
    authn =lilogame.registry.get_authn()
    request.cookie['ss'] =authn.spinner.sessionid
    
    # setup players
    dao =lilogame.registry.get_dao()
    for idx in xrange(0,5):
      fake_username ='u_{0}'.format(idx)
      fake_password ='p_{0}'.format(idx)
      fake_sessionid =authn.create_player_sessionid(fake_username, fake_password)
      dao.create_player(u=fake_username, s=fake_sessionid )
    
    players =dao.get_players()
    self.assertEqual( len(players), 5 )
    players[0].tileid =0
    players[1].tileid =0
    players[2].tileid =1
    players[3].tileid =2
    players[4].tileid =2
    
      
    b_rval =lilogame.webworker._rest_spinner_spin(request)
    self.assertEqual( players[0].cash , '20.0000')
    self.assertEqual( players[1].cash , '20.0000')
    self.assertEqual( players[2].cash ,  '1.0000')
    self.assertEqual( players[3].cash , '40.0000')
    self.assertEqual( players[4].cash , '40.0000')
    
    b_rval =lilogame.webworker._rest_spinner_spin(request)
    self.assertEqual( players[0].cash , '40.0000')
    self.assertEqual( players[1].cash , '40.0000')
    self.assertEqual( players[2].cash ,  '2.0000')
    self.assertEqual( players[3].cash , '80.0000')
    self.assertEqual( players[4].cash , '80.0000')
    
    players[0].tileid =0
    players[1].tileid =2
    players[2].tileid =1
    players[3].tileid =2
    players[4].tileid =2
    
    b_rval =lilogame.webworker._rest_spinner_spin(request)
    self.assertEqual( players[0].cash , '80.0000')
    self.assertEqual( players[1].cash , '66.6666')
    self.assertEqual( players[2].cash ,  '3.0000')
    self.assertEqual( players[3].cash , '106.6666')
    self.assertEqual( players[4].cash , '106.6666')
    
    b_rval =lilogame.webworker._rest_spinner_spin(request)
    self.assertEqual( players[0].cash , '120.0000')
    self.assertEqual( players[1].cash , '93.3332')
    self.assertEqual( players[2].cash ,  '4.0000')
    self.assertEqual( players[3].cash , '133.3332')
    self.assertEqual( players[4].cash , '133.3332')
    
    
if __name__ == "__main__":
  unittest.main()