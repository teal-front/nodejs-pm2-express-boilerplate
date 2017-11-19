'use strict';
/**
 * error handle
 */

module.exports = (error, req, res, next) => {
    const rpcError = require('../lib/error/rpc-error');

    // 仅仅为了阻止后续代码执行而抛出的异常
    if (error.message === "JUST BLOCK") {
        return;
    }

    if (error.message === 'NODE 404') {
        return res.status(404).render('./errors/404.ejs', {layout: false, error: error});
    }

    if (req.xhr || req.query.xhr) { // ajax
        error.data = error.data || {};
        if (error instanceof rpcError.rpcFail) {
            res.json({
                status: error.status,
                message: error.message,
                result: error.result
            });
        } else if (error.toString().indexOf('AUTH ERROR') > -1) {
            res.status(401).json({code: -1, status: '-99', message: '请先登录', msg: '请先登录'});
        } else {
            res.json({status: '-99', message: '请求错误'});
        }
    } else {
        if (error instanceof rpcError.rpcFail) {
            res.status(500).render('./errors/500.ejs', {layout: false, error: error, showError: true});
        } else if (error.toString().indexOf('AUTH ERROR') > -1) {
            res.redirect('/user/login');
        } else {
            res.status(500).render('./errors/500.ejs', {layout: false, error: error});
        }
    }
};