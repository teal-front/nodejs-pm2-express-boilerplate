'use strict';
/**
 * rpc error
 */

// todo
exports.rpcFail = (status, message, result) => {
    this.name = 'rpcFail';
    this.code = -99;
    this.status = status;
    this.result = result;
    this.message = message || '未知错误';
    
    Error.captureStackTrace(this, rpcFail);
};