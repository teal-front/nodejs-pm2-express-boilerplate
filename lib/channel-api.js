'use strict';
/**
 * rpc channle api
 */

const amqpRPC = require('./rpc');
const config = require('../config');

module.exports = amqpRPC.init(config.rabbitmq);
