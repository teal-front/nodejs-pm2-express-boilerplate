'use strict';
/**
 * utils
 */

/**
 * create business rpc promise object
 * @param fn {function} rpc method
 * @param reqData {object}
 * @param testData {object}
 * @returns {Promise}
 */
exports.spawnPromise = (fn, reqData, testData) => {
    return new Promise((resolve, reject) => {
        if (testData) {
            return resolve(testData);
        }
        fn(reqData, (err, data) => {
            err ? reject(err) : resolve(data);
        });
    });
};
