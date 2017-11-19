'use strict';
/**
 *
 */

const requestTools = require('../request/request-tools');
const channel = require('../lib/channel-api');

/**
 * get user useId
 */
exports.getUserId = (params, callback) => {
    channel.enables.request('demo', [params],
        requestTools.checkErrorRpc(callback, { checkCode: false })
    );
};