var Hapi = require('hapi');
var fs = require('fs');
var plugins = [];

var server = new Hapi.Server('0.0.0.0', 8000, { 
	views: {
        engines: { jade: 'jade' },
        path: __dirname + '/templates'
    }
});

server.route({ method: 'GET', path: '/', handler: function (request, reply) {
    reply.view("index", {plugins: plugins});  
}});

fs.readdirSync(__dirname + '/plugins').forEach(function (filename) {
    var plugin = require('./plugins/' + filename);
    plugins.push(filename); 
    server.pack.register(plugin, {}, function (err) {
        if (err)
            console.log('Failed to load plugin: ' + filename);
    });
});


server.start(function () {
    console.log("Go to http://localhost:8000/");
})
