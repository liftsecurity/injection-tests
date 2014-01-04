var Hapi = null; // Initialized during plugin registration
var textile_js = require('textile-js');

exports.name = "textile-js";
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
 
    plugin.route({ method: 'GET', path: '/textile-js', handler: function (request, reply) {
        reply.view('plugin', {marked: "", sanitized: "", name: exports.name});
    }});

    plugin.route({
        method: 'POST',
        path: '/textile-js',
        handler: function (request, reply) {
            reply.view('plugin', {input: request.payload.input, sanitized: textile_js(request.payload.input), name: exports.name});
    }});

    next();
};


internals.setHapi = function (module) {
    Hapi = Hapi || module;
};


