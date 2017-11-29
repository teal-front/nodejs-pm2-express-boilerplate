'use strict';
/**
 * rpc channle api
 */

const appName = require('../package.json').name || 'app';
const METHODS = require('./definitions').methods;
const rabbitmqOpt = require('../config').rabbitmq;
const redisClient = require('redis-client').getClient;

let amqpRPC = require('./amqp-rpc').factory(rabbitmqOpt);

// cb, context, options 好像还没有用到过
amqpRPC.request = function (cmd, params, cb, notDecode) {
    let timer;
    let reqData = this._buildRequestParams(cmd, params);
    let meta = {};

    meta.reqData = reqData;
    meta.startTime = Date.now();

    this.call(METHODS[cmd].serverId, reqData, function (message, timestamp) {
        let encoded_payload = (notDecode ? message.data : unescape(message.data));
        let payload;
        try {
            payload = JSON.parse(encoded_payload);
        } catch (e) {
            payload = {status: -1, msg: 'RPC Reponse parse JSON error'};
        }
        if (-1 == payload.status) {
            payload.exception = payload.exception || '系统错误';
        }
        payload.timestamp = new Date().getTime() - timestamp;
        clearTimeout(timer);
        meta.endTime = Date.now();
        cb(payload, meta);
    });

    // 超时处理
    timer = setTimeout(function () {
        meta.endTime = Date.now();
        cb({status: '-99', msg: '超时'}, meta);
        cb = function () {
        };
    }, rabbitmqOpt.timeout || 90 * 1000);
};

amqpRPC.requestNotDecode = function (cmd, params, cb, context, options) {
    return this.request(cmd, params, cb, context, options, true);
};

amqpRPC.requestFromCache = function (cmd, params, cb, expire, notDecode) {
    let that = this;
    let key = `${appName}:rpcamqp:${cmd}:${JSON.stringify(params)}`;

    redisClient.get(key, function (err, res) {
        let result;
        try {
            result = res ? JSON.parse(res) : null;
        } catch (err) {
            console.log('parse result fail from cache method method : %s params : %j error : ', cmd, params, err);
            return cb(result);
        }

        if ((result && result.code === 0)) {
            console.log('result from cache method : %s code : %d', cmd, result.code);
            return cb(result);
        }

        that.request(cmd, params, function (data) {
            if (data.code === 0) {
                redisClient.set(key, JSON.stringify(data), 'EX', expire || 300, function (err) {
                    if (err) {
                        console.log(`cache method to redis fail method :  ${cmd} : ${params}`);
                    }
                });
            }
            cb(data);
        }, notDecode || false);
    });
};

amqpRPC._buildRequestParams = function (cmd, params) {
    let method = METHODS[cmd];

    return {
        serviceId: method.serverId,
        parameters: params,
        command: `${method.interfaceId}.${method.name}`
    };
};


module.exports = {
    enables: {},
    init: function () {
        this.enables = amqpRPC;
    }
}