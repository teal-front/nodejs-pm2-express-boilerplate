'use strict';
/**
 * test config file
 */

// amqp config
const mqConf = {
    url: 'amqp://user:password@192.168.48.3:5672',
    heartbeat: 10,
};

module.exports = {
    port: '3000',
    env: 'test',
    redis: {
        sentinels: [
            { host: '192.168.48.1', port: 26379 },
            { host: '192.168.48.2', port: 26379 },
        ],
        password: 'xxxxxx',
        name: 'master',
        family: 4,
    },
    rabbitmq: mqConf,
    fileServer: {
        mq: mqConf,
        dfs: {
            trackers: [
                {
                    host: '192.168.48.4',
                    port: 999
                }
            ],
            timeout: 10000,
            defaultExt: 'txt',
            charset: 'utf8'
        }
    },
};