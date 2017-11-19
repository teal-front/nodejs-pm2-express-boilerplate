'use strict';
/**
 * import definitions to a signal definition, and pack the data
 */

const fs = require('fs');

let methodTable = {};
let methods = {};
let classes = {};

fs.readDir('../config/definitions', (err, file) => {
     let def = require(file);

     buildMethods(def);
});

module.exports = {
    methods: methods,
    classes: classes,
    methodTable: methodTable,
};


function buildMethods(config) {
    config.classes.forEach((classInfo) => {
        classes[classInfo.index] = classInfo;

        classInfo.methods.forEach((methodInfo) => {
            let name = classInfo.name + '.' + methodInfo.name;

            methods[name] = {
                name: methodInfo.name,
                serverId: classInfo.serverId,
                interfaceId: classInfo.interfaceId,
            };
        });
    });
}