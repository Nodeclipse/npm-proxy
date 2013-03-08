// substitute for CouchDB
// 1) use port :6084/npm-proxy/, connect to CoudDB registry database at https://registry.npmjs.org
// 2) use port :6084/hosted/, connect to CoudDB at :5984

//imports
var url = require("url");
var http = require("http");
var https = require("https");

//configuration {paths and database names}
var registry_URL = "http://registry.npmjs.org";
var npm_proxy_server_URL = 'localhost';
var CouchDB_server_URL = 'localhost';

var path_hosted = "/hosted/";
var path_mirror = "/npm-mirror/";	// synchronized with registry using CouchDB Replication feature
var path_proxy = "/npm-proxy/"; // proxied access to registry
var path_cached = "/cached/";	// cached from registry
var path_virtual = "/virtual/";	// combines several repositories

var db_hosted = "/npm-hosted";
var db_mirror = "/npm-mirror";
var db_cached = "/npm-cashed";

//init
// create CouchDB databases repo1 (hosted) & repo2 (mirror), npm-cached
// create DB from command line:
// curl -X PUT http://localhost:5984/registry
console.log('Creating CouchDB databases "++ JSON.stringify(dbs)+" ...');
var dbs = [db_hosted,db_mirror,db_cached];
for (var i = 0; i < dbs.length; i++)
{
	var db_name = dbs[i];
	var options = {
	  hostname: CouchDB_server_URL,
	  port: 5984,
	  path: db_name,
	  method: 'PUT'
	};

	var req = http.request(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	    console.log('BODY: ' + chunk);
	  });
	});

	req.on('error', function(e) {
	  console.log('Problem while creating database '+db_name+' : ' + e.message);
	});

	req.end();
}

//main
http.createServer(function(request, response) {
	var path = url.parse(request.url).path;

	if (path.indexOf(path_hosted) && path.indexOf(path_mirror) 
			&& path.indexOf(path_proxy) && path.indexOf(path_cached) && path.indexOf(path_virtual) ) {
		response.writeHead(404);
		response.end('Missing /npm-proxy/ or /hosted/ path!');
		return;
	}	
	//} else {
		var resource_path;
		var protocol = http;
		var options;
		var mode_cached = false;
		if (!path.indexOf(path_hosted)) {
			resource_path = path.slice(path_hosted.length); 			
			options = {
					host : "http://localhost",
					hostname : CouchDB_server_URL, 
					port : 5984, 
					method : request.method,
					path : db_hosted+"/"+resource_path, 
					headers : request.headers,
					//auth : location.auth
				};			
		} else if (!path.indexOf(path_mirror)) {
			resource_path = path.slice(path_mirror.length); 			
			options = {
					host : "http://localhost",
					hostname : CouchDB_server_URL, 
					port : 5984, 
					method : request.method,
					path : db_mirror+"/"+resource_path, 
					headers : request.headers,
					//auth : location.auth
				};			
		} else if (!path.indexOf(path_proxy)) {
			resource_path = path.slice(path_proxy.length); 			
			options = {
					host : registry_URL, 
					hostname : "registry.npmjs.org",
					port : 80, 
					method : request.method,
					path : resource_path,
					headers : request.headers,
					//auth : location.auth
				};			
		} else if (!path.indexOf(path_cached)) {
			mode_cached = true;
			resource_path = path.slice(path_cached.length); 			
			options = {
					host : "http://localhost",
					hostname : CouchDB_server_URL, 
					port : 5984, 
					method : request.method,
					path : db_cached+"/"+resource_path, 
					headers : request.headers,
					//auth : location.auth
				};			
		} else if (!path.indexOf(path_virtual)) { 
			resource_path = path.slice(path_virtual.length); 			
			options = { // like proxy
					host : registry_URL,
					hostname : "registry.npmjs.org",
					port : 80, 
					method : request.method,
					path : resource_path, 
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
		
		
		// http://nodejs.org/api/http.html#http_http_request_options_callback
		// clientRequest is request to couchDB (local or remote)
		var clientRequest = protocol.request(options, function(clientResponse) {
			
			console.log('STATUS: ' + clientResponse.statusCode+' HEADERS: ' + JSON.stringify(clientResponse.headers));
			if (mode_cached == true){
				if (clientResponse.statusCode == 404){
					console.log('STATUS: ' + clientResponse.statusCode);
				}
			}
			
			response.writeHead(clientResponse.statusCode, clientResponse.headers);
			clientResponse.on("data", response.write.bind(response)); 
			clientResponse.on("end", function() {
				response.addTrailers(clientResponse.trailers);
				response.end();
			});
		});

		request.on("data", clientRequest.write.bind(clientRequest)); 
		request.on("end", clientRequest.end.bind(clientRequest)); 
	//}
}).listen(6084);

console.log('NPM Proxy Server v0.0.5 running at http://localhost:6084/ ');
