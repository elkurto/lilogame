#!/bin/bash

cd /home/ubuntu/lilogame/src
export PYTHONPATH=.:/home/ubuntu/lilogame/src/site-packages
LOGFILE=/home/ubuntu/log/`date +%Y%m%dT%H%M`.log

nohup python run_lilogame.py 2>&1 > $LOGFILE &

