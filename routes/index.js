'use strict';
/**
 * enter of the index
 */

const router = modules.exports = require('express').Router();

router.use('/', (req, res, next) => {
    let pathModules = req.path.match(/\/(\w+)\/(\w+)/);
    try {
        let controller = pathModules[0],
            action = pathModules[1];
        let run = require(`./route-${controller}`)[action];

        run.apply(null, arguments);
    } catch (e) {
        console.error(e.code || 'MODULE_NOT_FOUND');
        next(e.code === 'MODULE_NOT_FOUND' ? new Error('NODE 404') : e);
    }
});