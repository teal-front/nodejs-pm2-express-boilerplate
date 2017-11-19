'use strict';
/**
 * the definition of MAIN section
 */

const serverId = 'rpc_service_demo';

exports.classes = [
    {
        "name": "demo2",
        "serverId": serverId,
        "interfaceId": "com.github.main",
        "methods": [
            {"name": "method1"},
            {"name": "method2"},
        ]
    }
];