// NPM-Proxy by Paul Verest, March 2013

//configuration {servers, paths and database names}
//var registry_URL = "http://registry.npmjs.org";
var registry_URL = "http://isaacs.iriscouch.com/registry/";
var npm_proxy_server_name = 'Node Package Server v0.1.0';
var npm_proxy_server_URL = 'localhost';
var npm_proxy_server_port = 6084;
var CouchDB_server_URL = 'localhost';

var path_cached = "/nps-cached/";	// cached from registry - main mode
var path_hosted = "/nps-hosted/";
var path_mirror = "/nps-mirror/";	// synchronized with registry using CouchDB Replication feature
var path_proxy = "/nps-proxy/"; 	// proxied access to registry - can be used while developing
var path_virtual = "/virtual/";		// combines several repositories
var paths = [path_hosted,path_mirror,path_proxy,path_cached,path_virtual];

// CouchDB db name can't contain '-'
var db_cached = "nps_cashed";
var db_hosted = "nps_hosted";
var db_mirror = "nps_mirror";

//imports
var url = require("url");
var http = require("http");
//var https = require("https");

//init
// create CouchDB databases:
var dbs = [db_cached,db_hosted,db_mirror];
// create DB from command line:
// curl -X PUT http://localhost:5984/registry
console.log('Creating & using CouchDB databases '+ JSON.stringify(dbs)+' ...');
for (var i = 0; i < dbs.length; i++)
{
	var db_name = dbs[i];
	var options = {
	  hostname: CouchDB_server_URL,
	  port: 5984,
	  path:'/'+db_name,
	  method: 'PUT'
	};
	var req = http.request(options, function(res) {
	  console.log('STATUS: ' + res.statusCode+' HEADERS: ' + JSON.stringify(res.headers));
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
//TODO clone _design docs from Registry

//main
http.createServer(function(request, response) {
	var path = url.parse(request.url).path;

	if (path.indexOf(path_cached) && path.indexOf(path_hosted) && path.indexOf(path_mirror) 
			&& path.indexOf(path_proxy) && path.indexOf(path_virtual) ) {
		//case 1
		response.writeHead(200);
		response.write(npm_proxy_server_name+' is running at http://'+npm_proxy_server_URL+':'+npm_proxy_server_port+'/ ');
		//response.write('<br>Try http://'+npm_proxy_server_URL+':'+npm_proxy_server_port+path_proxy);
		response.write('<br> Try http://'+npm_proxy_server_URL+':'+npm_proxy_server_port+path_cached);
		//response.end('Missing /npm-proxy/ or /hosted/ path!');
		response.end();
		return;
	}	
	//} else {
		var resource_path;
		var protocol = http;
		var options;
		var mode_cached = false;
		if (!path.indexOf(path_cached)) {
			mode_cached = true;
			resource_path = path.slice(path_cached.length); 			
			options = {
					hostname : CouchDB_server_URL, 
					port : 5984, 
					method : request.method,
					path : '/'+db_cached+"/"+resource_path, 
					headers : request.headers,
					//auth : location.auth
				};			
		} else if (!path.indexOf(path_hosted)) {
			resource_path = path.slice(path_hosted.length); 			
			options = {
					hostname : CouchDB_server_URL, 
					port : 5984, 
					method : request.method,
					path : '/'+db_hosted+"/"+resource_path, 
					headers : request.headers,
					//auth : location.auth
				};			
		} else if (!path.indexOf(path_mirror)) {
			resource_path = path.slice(path_mirror.length); 			
			options = {
					hostname : CouchDB_server_URL, 
					port : 5984, 
					method : request.method,
					path : '/'+db_mirror+"/"+resource_path, 
					headers : request.headers,
					//auth : location.auth
				};			
		} else if (!path.indexOf(path_proxy)) { //FIXME case when registry_URL has path
			resource_path = path.slice(path_proxy.length); 			
			options = {
					hostname : registry_URL,
					port : 80, 
					method : request.method,
					path : resource_path,
					headers : request.headers,
					//auth : location.auth
				};			
		} else if (!path.indexOf(path_virtual)) { 
			resource_path = path.slice(path_virtual.length); 			
			options = { // like proxy
					hostname : registry_URL,
					port : 80, 
					method : request.method,
					path : resource_path, 
					headers : request.headers,
					//auth : location.auth
				};			
		}

		console.log(
				//"->  host: "+options.host
	            " hostname: "+options.hostname
	            +" port: "+options.port
	            +" method: "+ options.method
	            +" path: "+ options.path
				+" resource_path: "+resource_path				
	            +" headers: "+ options.headers
	            //+" auth: "+ options.auth
	            );
		
		
		delete options.headers.host;
		
		
		// http://nodejs.org/api/http.html#http_http_request_options_callback
		// couchdbRequest is request to couchDB (local or remote)
		var couchdbRequest = protocol.request(options, function(couchdbResponse) {			
			console.log('STATUS: ' + couchdbResponse.statusCode+' HEADERS: ' + JSON.stringify(couchdbResponse.headers));
			if (mode_cached !== true){
				//case 2 - answering with CouchDB response
				response.writeHead(couchdbResponse.statusCode, couchdbResponse.headers);
				couchdbResponse.on("data", response.write.bind(response)); 
				couchdbResponse.on("end", function() {
					response.addTrailers(couchdbResponse.trailers);
					response.end();
				});
			}else{
				if (couchdbResponse.statusCode !== 404){
					//TODO check if there is update
					//case 2 - answering with CouchDB response
					response.writeHead(couchdbResponse.statusCode, couchdbResponse.headers);
					couchdbResponse.on("data", response.write.bind(response)); 
					couchdbResponse.on("end", function() {
						response.addTrailers(couchdbResponse.trailers);
						response.end();
					});					
				}else{//couchdbResponse.statusCode == 404
					console.log('REP Starting replication '+resource_path+' ...');
					
					//replication
					var options = {
					  hostname: CouchDB_server_URL,
					  port: 5984,
					  path: '/_replicate', 
					  method: 'POST',
					  headers: { 'content-type': 'application/json' }
					};
					// see below at req.write
					var json_replication_string = '{"source":"'+registry_URL+'", "target":"'+db_cached+'", "doc_ids":["'+resource_path+'"]}';
					var req = http.request(options, function(res) {
					  console.log('REP STATUS: ' + res.statusCode +' REP HEADERS: ' + JSON.stringify(res.headers) );
					  res.setEncoding('utf8');
					  res.on('data', function (chunk) {
					    console.log('REP BODY: ' + chunk);
					  });
					  //++
					  res.on('end', function (anything) {
						  console.log('res end of replication '+resource_path);
						  //create new request to couchDB and return its result to npm client
						  var couchdbRequest2 = protocol.request(options, function(couchdbResponse2) {
							  console.log('2 STATUS: ' + couchdbResponse2.statusCode+' HEADERS: ' + JSON.stringify(couchdbResponse2.headers));

							  //case 3 - answering with newly replicated data
							  response.writeHead(couchdbResponse2.statusCode, couchdbResponse2.headers);
							  couchdbResponse2.on("data", response.write.bind(response)); 
							  couchdbResponse2.on("end", function() {
								response.addTrailers(couchdbResponse2.trailers);
								response.end();
								
							  });							  
						  });//couchdbRequest2					  
					  });//replication  responseListener
					  
					});
					//req.on('error', function(e) {
					//  console.log('problem with request: ' + e.message);
					//});
					req.write(json_replication_string);
					//req.write('{"source":"http://registry.npmjs.org/", "target":"npm-mirror", "doc_ids":["10ctl"], "connection_timeout": 60000, "retries_per_request": 20, "http_connections": 30}');
					req.end();
				};
			}//mode_cached == true
		});//couchdbRequest
		request.on("data", couchdbRequest.write.bind(couchdbRequest)); 
		request.on("end", couchdbRequest.end.bind(couchdbRequest)); 
	//}
}).listen(npm_proxy_server_port);

console.log(npm_proxy_server_name+' running at http://'+npm_proxy_server_URL+':'+npm_proxy_server_port+'/ ');
