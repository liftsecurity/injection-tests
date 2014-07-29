var Hapi = null; // Initialized during plugin registration
var marked = require('marked');
var sanitizer = require('sanitizer');
var jade = require('jade');
var Hoek = require('hoek');


marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

exports.name = "marked";
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
 
    plugin.route({
        method: 'GET', 
        path: '/' + exports.name, 
        handler: function (request, reply) { 
            marked.setOptions({
                sanitize: false
            });
            if (request.query.input) {
                console.log(request.query.input);
                reply(marked(request.query.input));
            } else {
                reply.view("plugin",{marked: "", input:"", name: exports.name});
            }
        }
    }); 

    plugin.route({
        method: 'POST',
        path: '/' + exports.name,
        handler: function (request, reply) {
            if (request.payload.unsafe == "true") {
                marked.setOptions({
                    sanitize: false
                });
            } else {
                marked.setOptions({
                    sanitize: true
                });
            }
            if (request.payload.sanitize == "true") {
                reply.view("plugin", {input: request.payload.input, marked: sanitizer.sanitize(marked(request.payload.input)), name: exports.name});
            } else {
                reply.view("plugin", {input: request.payload.input, marked: marked(request.payload.input), name: exports.name});
            }
        }
    });

    next();
};


internals.setHapi = function (module) {
    Hapi = Hapi || module;
};


