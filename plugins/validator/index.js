var Hapi = null; // Initialized during plugin registration
var validator = require('node-validator');
var jade = require('jade');
var Hoek = require('hoek');

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
    var settings = Hoek.applyToDefaults(internals.defaults, options);

    plugin.views({
        engines: { jade: jade },
        path: __dirname + '/templates'
    });
 
    plugin.route({ method: 'GET', path: '/' + exports.name, handler: function (request, reply) {
        reply.view("plugin", {marked: "", sanitized: "", name: exports.name});
    }});

    plugin.route({
        method: 'POST',
        path: '/' + exports.name,
        handler: function (request, reply) {
            reply.view("plugin", {input: request.payload.input, sanitized: validator(request.payload.input).escape(), name: exports.name});
    }});

    next();
};


internals.setHapi = function (module) {
    Hapi = Hapi || module;
};


