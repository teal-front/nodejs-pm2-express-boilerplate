'use strict';
/**
 * file middleware
 */

const fastdfsClient = require('fastdfs-client');

fastdfsClient.initDefaultClient(require('../config').fileServer);


/**
 * download file use fastdfs
 */
exports.download = (fileId) => {
    fileId = Number(fileId);

    return (req, res, next) => {
        try {
            fastdfsClient.getDefaultClient().download(fileId, (err, result) => {
                res.download(result.filePath, result.fileName);
            });
        } catch (e) {
            res.status(404).end('404');
        }
    };
};