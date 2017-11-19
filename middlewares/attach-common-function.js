'use strict';
/**
 * 包装req res 对象，赋予常用方法
 */

// 此ua的库并不是很全，缺少爬虫、一些新式浏览器的判断 todo
const UAParser = require('ua-parser-js');

module.exports = (req, res, next) => {
    /**
     * common error page
     */
    res.errRes = (error) => {
        res.status(500).send('服务器内部繁忙');
    };

    /**
     * 封装统一的前端ajax response
     * @param result
     * @param status
     * @param message
     */
    res.api = (result, status, message) => {
        let dataApi = {
            status: status || '0',
            message: message || '',
            result: result
        };
        res.json(dataApi);
    };

    /**
     * get ua information
     * @type {{os, userAgent}}
     */
    req.ua = (function () {
        const uaParse = new UAParser();
        const userAgent = req.headers['user-agent'];
        uaParse.setUA(userAgent);
        const result = uaParse.getResult();

        return {
            os: result.os,
            userAgent: req.headers['user-agent']
        };
    })();

    next();
};