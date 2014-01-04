var Hapi = null; // Initialized during plugin registration
var validator = require('validator').sanitize;

exports.name = "validator";
exports.version = "1.0.0";

var internals = {};

internals.defaults = {
    handler: function (request, config, next) {
        next();
    }
};

exports.register = function (plugin, options, next) {
    internals.setHapi(plugin.hapi);
    var Utils = plugin.hapi.utils
    var settings = Utils.applyToDefaults(internals.defaults, options);

    plugin.views({
        engines: { jade: 'jade' },
        path: __dirname + '/templates'
    });
 
    plugin.route({ method: 'GET', path: '/validator', handler: function (request, reply) {
        reply.view("validator", {marked: "", sanitized: ""});
    }});

    plugin.route({
        method: 'POST',
        path: '/validator',
        handler: function (request, reply) {
            reply.view("validator", {input: request.payload.input, sanitized: validator(request.payload.input).escape()});
    }});

    next();
};


internals.setHapi = function (module) {
    Hapi = Hapi || module;
};


