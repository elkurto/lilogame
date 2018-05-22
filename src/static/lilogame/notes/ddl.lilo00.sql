-- player
-- game
-- room
-- role
-- user
-- roleuser

create table game
( id     integer primary key autoincrement
, name   varchar(64)
, gamesecret varchar(64)
)
;
insert into game (id,name,gamesecret) value (1, 'test game', "ANDKEUCLPO834750237450BB")
;

create table player 
( id       int  primary key autoincrement
, name     varchar(256)
, loginid  varchar(16)
, cash     real(16,4)
)
;

create table tile
( id                  integer primary key 
, gameid              integer foreign key references game(id)
, payout              integer 
, p_numerator         integer
, p_denominator       integer
, icon                varchar(256)
, state               varchar(64)
, n_population        integer
, payout_per_player   real(16.4)
, randx1000           integer
, n_round               integer
, paystrategy         varchar(64)
)
;

insert into tiles
( id                  
, payout              
, p_numerator         
, p_denominator       
, icon                
, state               
, n_population        
, payout_per_player   
, randx1000           
, n_round               
, paystrategy         
) values 
( 0
, 40
, 1
, 4
, '../images/icon-slice-lemon.svg'
, 'initial'
, 0
, null
, 0
, 0
, 'compute_payout_per_player'
);

insert into tiles
( id                  
, payout              
, p_numerator         
, p_denominator       
, icon                
, state               
, n_population        
, payout_per_player   
, randx1000           
, n_round               
, paystrategy         
) values 
( 1
, 1
, 1
, 1
, '../images/icon-slice-lime.svg'
, 'initial'
, 0
, null
, 0
, 0
, 'one_dollar_each'
);

insert into tiles
( id                  
, payout              
, p_numerator         
, p_denominator       
, icon                
, state               
, n_population        
, payout_per_player   
, randx1000           
, n_round               
, paystrategy                    
) values                  
( 2
, 80
, 1
, 8
, '../images/icon-slice-orange.svg'
, 'initial'
, 0
, null
, 0
, 0
, 'compute_payout_per_player'
);



create table playertile
( playerid     integer foreign key references player(id)
, tileid       integer foreign key references tile(id)
)
;

create table role
( id    varchar(64)
)
;
insert into role ( id ) values ( 'spinner' )
;
insert into role ( id ) values ( 'basic' )
;

create table user
( id     integer  primary key autoincrement
, name   varchar(256)
, secret varchar(256)
)
;
insert into user (id,name,secret) values (1, 'elkurto', 'aeiou1' )
;

create table roleuser
( roleid  varchar(64)  foreign key references role(id)
, userid  integer      foreign key references user(id)
, constraint primary key (roleid,userid)
)
;
insert into roleuser (roleid,userid) values ('spinner',1)
;

