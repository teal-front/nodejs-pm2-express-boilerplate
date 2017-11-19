#!/usr/bin/env bash

# 用于发布系统，或是CI使用

app=demo
pm2file=pm2.json

start () {
     pm2 start ../$pm2file
     echo 'Sever has been started'
}

stop(){
    pm2 stop ../$pm2file
    echo 'Server has been stopped'
}

restart(){
    pm2 reload ../$pm2file
    echo 'Server has been restarted'
}

status(){
    pm2 ls
}

case $1 in
    start)
        start;
    ;;
    stop)
        stop;
    ;;
    reload)
        restart
    ;;
    restart)
        restart;
    ;;
    status)
        status;
    ;;
    *)
    echo "Usage: server.sh {start|stop|restart|status}"
    ;;
esac

exit 0