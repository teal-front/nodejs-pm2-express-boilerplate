'use strict';
/**
 * rpc channle api
 */

const METHODS = require('./definitions').methods;
const rabbitmqOpt = require('../config').rabbitmq;

let amqpRPC = require('./amqp-rpc').factory(rabbitmqOpt);

amqpRPC.request = function (cmd, params, cb, context, options, notDecode) {
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
    }, context, options);

    // 超时处理
    timer = setTimeout(function () {
        meta.endTime = Date.now();
        cb({status: '-99', msg: '超时'}, meta);
        cb = function () {};
    }, rabbitmqOpt.timeout || 90 * 1000);
};

amqpRPC.requestNotDecode = function (cmd, params, cb, context, options) {
    return this.request(cmd, params, cb, context, options, true);
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