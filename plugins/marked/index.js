var Hapi = null; // Initialized during plugin registration
var marked = require('marked');
var sanitizer = require('sanitizer');


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
    var Utils = plugin.hapi.utils
    var settings = Utils.applyToDefaults(internals.defaults, options);

    plugin.views({
        engines: { jade: 'jade' },
        path: __dirname + '/templates'
    });
 
    plugin.route({
        method: 'GET', 
        path: '/marked', 
        handler: function (request, reply) { 
            if (request.query.input) {
                console.log(request.query.input);
                reply(marked(request.query.input));
            } else {
                reply.view("marked",{marked: "", input:""});
            }
        }
    }); 

    plugin.route({
        method: 'POST',
        path: '/marked',
        handler: function (request, reply) {
            if (request.payload.unsafe == "true") {
                marked.setOptions({
                    sanitize: false
                });
            }
            if (request.payload.sanitize == "true") {
                reply.view("marked", {input: request.payload.input, marked: sanitizer.sanitize(marked(request.payload.input))});
            } else {
                reply.view("marked", {input: request.payload.input, marked: marked(request.payload.input)});
            }
        }
    });

    next();
};


internals.setHapi = function (module) {
    Hapi = Hapi || module;
};


