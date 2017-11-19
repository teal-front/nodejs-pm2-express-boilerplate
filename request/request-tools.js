'use strict';
/**
 * rpc request tool
 */

const rpcError = require('../lib/error/rpc-error');

/**
 * 请求错误处理通用方法
 * @param  {Function} successCallback  [无任何错误的时应该执行的回调]
 * @param  {Function} originalCallback [原始回调，用于出错时直接调用]
 * @return {Function}                  [返回适用于request处理的回调方法]
 */
exports.checkError = (successCallback, originalCallback) => {
    originalCallback = originalCallback || successCallback;

    return (error, response, body) => {
        let href = '';

        if (response && response.request && response.request.uri) {
            href = response.request.uri.href
        }

        if (error) {
            return originalCallback(new Error('SERVICE ERROR: ' + error.toString() + ', URI ' + href), null);
        }

        try {
            if (response && response.statusCode == 200) {
                let data = JSON.parse(body);
                if (data.code === 0) {
                    successCallback(null, data.data, data);
                } else {
                    originalCallback(new Error('SERVICE ERROR: CODE ' + data.code + ', MSG ' + data.msg + ', URI ' + href), null);
                }
            } else {
                originalCallback(new Error('SERVICE ERROR: STATUS ' + (response ? response.statusCode : 'NO RESPONSE') + ', URI ' + href), null);
            }
        } catch (e) {
            originalCallback(new Error('SERVICE DATA ERROR: ' + e.toString() + ', DATA ' + body + ', URI ' + href), null);
        }
    }
};


exports.checkErrorRpc = (callback, opts) => {
    opts = opts || {};
    return (data, meta) => {
        let myErr;
        let dataResult;
        data = data || {};
        console.log('RPC返回数据|接口|' + meta.cmd + '|参数|' + meta.params + '|' + JSON.stringify(data));
        if (data.status === "00000") {
            dataResult = data.result != null ? data.result : {};
            data.result = data.result || {};

            if (opts.checkCode === false) {
                callback(null, dataResult, data);
            } else {
                if (data.result.code === 0) {
                    callback(null, data.result.data, data);
                }
                else {
                    myErr = new Error('SERVICE ERROR: CODE ' + data.result.code + ', MSG ' + (data.result.Message || data.result.msg));
                    callback(myErr, data.result.data, data.result);
                }
            }
        } else {
            if (data.status === '-1') {
                myErr = new Error('SERVICE ERROR: STAUTUS ' + data.status + ', MSG ' + data.msg);
                callback(myErr, data.result, data);
            }
            else {
                myErr = new rpcError.rpcFail(data.status, data.exception);
                callback(myErr, data.result, data);
            }
        }
    }
};

// 一层结构
exports.checkErrorRpcOnly = () => {
    return (data, meta) => {
        let myErr;
        data = data || {};
        console.log('RPC返回数据|接口|' + meta.cmd + '|参数|' + meta.params + '|' + JSON.stringify(data));

        if (data.status === '00000') {
            return callback(null, data.result.result, data);
        }
        if (data.status === '-1') {
            myErr = new Error('SERVICE ERROR: STAUTUS ' + data.status + ', MSG ' + data.exception);
            return callback(myErr, null, data);
        }

        myErr = new rpcError.rpcFail((data.result || {}).status, (data.result || {}).exception);
        callback(myErr, (data.result || {}).result, data);
    }
};

// 两层结构，{rsult: {status:.., reuslt:...}, status ...}
exports.checkErrorRpcWithStatus = (callback) => {
    return (data, meta) => {
        let myErr;
        data = data || {};
        console.log('RPC返回数据|接口|' + meta.cmd + '|参数|' + meta.params + '|' + JSON.stringify(data));

        if (data.status === '00000') {
            if (data.result && data.result.status === '00000') {
                callback(null, data.result.result, data);
            } else {
                myErr = new rpcError.rpcFail((data.result || {}).status, (data.result || {}).exception);
                callback(myErr, (data.result || {}).result, data);
            }
        } else {
            myErr = new Error('SERVICE ERROR: STAUTUS ' + data.status + ', MSG ' + data.exception);
            callback(myErr, null, data);
        }
    }
};

/**
 * 给方法增加promise返回值
 * 约定：需要附加promise的方法，最后一个参数必须是回调方法, 且回调的参数为err, data
 *
 */
exports.attachPromise = (requestFunction, opts) => {
    return () => {
        let args = arguments;
        opts = opts || {};

        return new Promise((resolve, reject) => {
            let promiseCallback = (err, data) => {
                if (err) {
                    err.data = data;
                    reject(err);
                }
                resolve(data);
            };

            let argsNew = [].slice.apply(args);
            argsNew.push(promiseCallback);

            requestFunction.apply(opts.context, argsNew);
        });
    }
}