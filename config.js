'use strict';
/**
 * global config 
 */

const env = process.env.NODE_ENV || 'production';
const svrCnf = require(`./config/env/${env}`);

let comCfg = {
	// some common config here
};

module.exports = Object.assign({}, svrCnf, comCfg);
