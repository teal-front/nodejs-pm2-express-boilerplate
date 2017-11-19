'use strict';
/**
 * session about login
 */


const requestUser = require('./request/request-user');

exports.attachSession = (req, res, next) => {
    if (req.session.userId) {
        // todo add token refresh
        return next()
    }

    const token = req.cookies['token'];
    if (token) {
        requestUser.getUserId(token, (err, data) => {
            if (err) return next(err);

            req.session.userId = data.userId;
        });
    }
};
