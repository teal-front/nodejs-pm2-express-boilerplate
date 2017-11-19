'use strict';

exports.index = (req, res, next) => {
    res.render('../virews/index', {
        title: 'main page',
    });
};