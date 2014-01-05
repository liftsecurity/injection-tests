var Hapi = null; // Initialized during plugin registration
var bbcode = require('bbcode');

exports.name = "bbcode";
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
 
    plugin.route({ method: 'GET', path: '/' + exports.name, handler: function (request, reply) {
        reply.view("plugin", {marked: "", sanitized: "", name: exports.name});
    }});

    plugin.route({
        method: 'POST',
        path: '/' + exports.name,
        handler: function (request, reply) {
            bbcode.parse(request.payload.input, function (content) {
                reply.view("plugin", {input: request.payload.input, sanitized: content, name: exports.name});
            });
    }});

    next();
};


internals.setHapi = function (module) {
    Hapi = Hapi || module;
};

