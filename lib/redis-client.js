'use strict';
/**
 * redis-client
 */
const Redis = require('ioredis');
const redisCnf = require("./config").redis;

// session client
const sessionClient = createClient(0);
// other except client
const otherClient = createClient(15);


module.exports = {
    // session only
    getSessionClient () {
        return sessionClient;
    },
    // other except session
    getClient () {
        return otherClient;
    },
};


function createClient (db) {
    const client = new Redis(Object.assign({}, redisCnf, {
        db: db
    }));
    client.on('connect', () => {
        console.log(`redis client connect OK. use db: ${db}`)
    });
    client.on('error', (err) => {
        console.error('redis ERROR: ' + err)
    });

    return client;
}