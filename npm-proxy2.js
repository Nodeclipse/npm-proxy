// substitute for CouchDB
// 1) use port :6084/npm-proxy/, connect to CoudDB registry database at https://registry.npmjs.org
// 2) use port :6084/hosted/, connect to CoudDB at :5984

//imports
var url = require("url");
var http = require("http");
var https = require("https");

//configuration

//main
http.createServer(function(request, response) {
	var path = url.parse(request.url).path;

	if (path.indexOf("/npm-proxy/") && path.indexOf("/hosted/")) {
		response.writeHead(404);
		response.end('Missing /npm-proxy/ or /hosted/ path!');
	} else {
		var path2;
		var protocol = http;
		var options;
		if (!path.indexOf("/hosted/")) {
			path2 = path.slice(8); 			
			options = {
					host : "http://localhost",
					hostname : "localhost", //location.hostname,
					port : 5984, //+location.port,
					method : request.method,
					path : path2, //"repo1/"+path2, //location.path,  //FIXME "repo1/"+path2
					headers : request.headers,
					//auth : location.auth
				};			
		} else if (!path.indexOf("/npm-proxy/")) {
			path2 = path.slice(11); 			
			options = {
					host : "https://registry.npmjs.org", //location.host, //"https://registry.npmjs.org",
					hostname : "registry.npmjs.org", //location.hostname,
					port : 80, //+location.port,
					method : request.method,
					path : path2, //location.path,
					headers : request.headers,
					//auth : location.auth
				};			
		}

		console.log("-> host: "+options.host
	            +" hostname: "+options.hostname,
	            +" port: "+options.port
	            +" method: "+ options.method
	            +" path: "+ options.path
	            +" headers: "+ options.headers
	            +" auth: "+ options.auth);
		
		
		delete options.headers.host;
		var clientRequest = protocol.request(options, function(clientResponse) {
			response.writeHead(clientResponse.statusCode, clientResponse.headers);
			clientResponse.on("data", response.write.bind(response)); 
			clientResponse.on("end", function() {
				response.addTrailers(clientResponse.trailers);
				response.end();
			});
		});

		request.on("data", clientRequest.write.bind(clientRequest)); 
		request.on("end", clientRequest.end.bind(clientRequest)); 
	}
}).listen(6084);

console.log('NPM Proxy Server v0.0.2 running at http://localhost:6084/npm-proxy/');
