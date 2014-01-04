var Hapi = require('hapi');
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

var server = new Hapi.Server('0.0.0.0', 8000, { 
	cors: true,
	views: {
        engines: { jade: 'jade' },
        path: __dirname + '/templates'
    }
});

server.route({ method: 'GET', path: '/', handler: function (request, reply) {
    reply.view("index", {});  
}});

server.route({ method: 'GET', path: '/marked', handler: function (request, reply) {
	if (request.query.input) {
		console.log(request.query.input);
		reply(marked(request.query.input));
	} else {
		reply.view("marked",{marked: "", input:""});
	}
}});

server.route({
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
}});

server.start(function () {
    console.log("Go to http://localhost:8000/");
})
