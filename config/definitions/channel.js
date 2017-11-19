'use strict';
/**
 * the definition of CHANNEL section
 */

const serverId = 'rpc_service_demo';

exports.classes = [
    {
        "name": "demo",
        "serverId": serverId,
        "interfaceId": "com.github.channel",
        "methods": [
            {"name": "method1"},
            {"name": "method2"},
        ]
    }
];
