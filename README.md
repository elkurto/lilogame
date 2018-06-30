# LiLoGame - Slapped together in a few days.
The Lilogame was created for two reasons:  
1. Impress some interns with a basic online game to play at meeting of 50 team-members. 
2. Test and observe individual behaviors in a game of chance with an information delay.  

## Installation - run locally
1. Download and install python2.7  

2. download/clone lilogame repo  (https://github.com/elkurto/lilogame.git)  

3. cd <path>/lilogame/src/  

4. set PYTHONPATH  
```
    #in bash  
    export PYTHONPATH=.:site-packages

    #in cmd.exe (windows)  
    set PYTHONPATH=.;site-packages
```    
5. start the webserver
    python run_lilogame.py
    
6. Spinner (basically the person who roles the dice) authenticates to :
    http://&lt;hostname&gt;:5000/static/lilogame/spinner.html  
     username: elkurto  
     password: aeiou1  
     
7. Players 
    authenticate http://&lt;hostname&gt;:5000/static/lilogame/login.html
      Just choose any username,password not already in use.
      
## GamePlay:
### Just click on the UI -- you won`t break it.  
a. Players choose a tile by clicking on the tile: (typically 1,2,3).     
  
b. Each tile displays, Population, probability, payout amount (upon win), and payout strategy.  
  
c. There exist two "Payout strategies"   
  (*each* - all players in tile received displayed amount) and    
  (shared - upon win player receive payout/population)  
  
d. Spinner clicks the Spin button invoke random draws (calculate winning/losing tile).  
  
e. There exists player board that shows username and winnings for the current game.  
    http://&lt;hostname&gt;:5000/static/lilogame/leaderboard.html   
    
f. After 100 rounds; the Player with the most fake-money wins.  


  
