// Node Package Server (NPS) by Paul Verest, 2013
var npm_proxy_server_name = 'Node Package Server v0.3.0';

//configuration {servers, paths and database names}
var config = require("./nps-config");

//imports
var url = require("url");
var http = require("http");
//var https = require("https");

//init
var registry_URL = config.registry_URL; //"http://isaacs.iriscouch.com/registry/"; // use HTTP URL
var npm_proxy_server_URL = config.npm_proxy_server_URL; //'localhost';
var npm_proxy_server_port = config.npm_proxy_server_port; //6084;
var CouchDB_server_URL = config.CouchDB_server_URL; //'localhost';
var couchDB_server_port = config.couchDB_server_port; //5984;

var path_cached = "/nps-cached/";	// cached from registry - main mode
var path_hosted = "/nps-hosted/";
var path_mirror = "/nps-mirror/";	// synchronized with registry using CouchDB Replication feature
var path_proxy = "/nps-proxy/"; 	// proxied access to registry - can be used while developing
var path_virtual = "/virtual/";		// combines several repositories
var paths = [path_cached,path_hosted,path_mirror,path_proxy,path_virtual];

// CouchDB db name can't contain '-'
var db_cached = "nps_cached";
var db_hosted = "nps_hosted";
var db_mirror = "nps_mirror";

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
	  port: couchDB_server_port,
	  path:'/'+db_name,
	  method: 'PUT'
	};
	var req = http.request(options, function(res) {
//		if (res.statusCode == 412) {
//			console.log(this.options.path + ' already exists.');
//			return;
//		}
		console.log('STATUS: ' + res.statusCode + ' HEADERS: '+ JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
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
var nps = http.createServer(function(request, response) {
	var path = url.parse(request.url).path;

	if (path.indexOf(path_cached) && path.indexOf(path_hosted) && path.indexOf(path_mirror) 
			&& path.indexOf(path_proxy) && path.indexOf(path_virtual) ) {
		//case 1
		response.writeHead(200);
		response.write(npm_proxy_server_name+' is running at http://'+npm_proxy_server_URL+':'+npm_proxy_server_port+'/ \n');
		response.write('CouchDB is at http://'+CouchDB_server_URL+':'+couchDB_server_port+'/ \n');
		response.write('CouchDB Futon UI is at http://'+CouchDB_server_URL+':'+couchDB_server_port+'/_utils/ \n\n');

		response.write('Main CouchDB database is '+db_cached+' at http://'+npm_proxy_server_URL+':'+npm_proxy_server_port+path_cached);
		//response.write('<br>Try http://'+npm_proxy_server_URL+':'+npm_proxy_server_port+path_proxy);
		//response.end('Missing /npm-proxy/ or /hosted/ path!');
		response.end();
		console.log('Saying hello for path '+path);
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
			"request"
			//"->  host: "+options.host
	        +" hostname: "+options.hostname
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
			console.log('couchdbResponse STATUS: ' + couchdbResponse.statusCode+' HEADERS: ' + JSON.stringify(couchdbResponse.headers));
			if (mode_cached !== true){
				//case 2 - answering with CouchDB response
				console.log('response: forward for '+resource_path+' ...');
				response.writeHead(couchdbResponse.statusCode, couchdbResponse.headers);
				couchdbResponse.on("data", response.write.bind(response)); 
				couchdbResponse.on("end", function() {
					response.addTrailers(couchdbResponse.trailers);
					response.end();
				});
				return;
			}
			//else{
			if (couchdbResponse.statusCode !== 404){
				//TODO check if there is update
				//case 2 - answering with CouchDB response
				console.log('response: Cache hit for '+resource_path);
				response.writeHead(couchdbResponse.statusCode, couchdbResponse.headers);
				couchdbResponse.on("data", response.write.bind(response)); 
				couchdbResponse.on("end", function() {
					response.addTrailers(couchdbResponse.trailers);
					response.end();
				});	
				return;
			}
			//else{//couchdbResponse.statusCode == 404
			// IDEA can I get response from Registry, give to client and in the same time write to db, i.e. archive that without replication?
			
			console.log('REP Starting replication '+resource_path+' ...');
			
			//replication
			var options2 = {
			  hostname: CouchDB_server_URL,
			  port: 5984,
			  path: '/_replicate', 
			  method: 'POST',
			  headers: { 'content-type': 'application/json' }
			};
			// replication request
			// client will receive response from CouchDB, but after replication request is succeeded and replication is finished
			var repreq = http.request(options2, function(res) {
				console.log('REP STATUS: ' + res.statusCode +' REP HEADERS: ' + JSON.stringify(res.headers) );
				res.setEncoding('utf8');
				res.on('data', function (chunk) {
					console.log('REP BODY: ' + chunk);
				});
				res.on('end', function (anything) {
					console.log('res end of replication '+resource_path);
					//response.writeHead(302, {'Location': request.url});
					//response.end()
					
					//create new request to couchDB and return its result to npm client
					//console.log(JSON.stringify(options2,null,4));
					var couchdbRequest2 = protocol.request(options, function(couchdbResponse2) {
						console.log('2 STATUS: ' + couchdbResponse2.statusCode+' HEADERS: ' + JSON.stringify(couchdbResponse2.headers));
						//case 3 - answering with newly replicated data
						response.writeHead(couchdbResponse2.statusCode, couchdbResponse2.headers);
						//couchdbResponse2.on("data", response.write.bind(response)); 
						var data = '';
						couchdbResponse2.on("data", function(chunk){
							data += chunk;
						}); 
						couchdbResponse2.on("end", function() {
							// console.log('received:' + data );
							console.log('couchdbResponse2 end');
							// TODO do we need?
							//response.addTrailers(couchdbResponse2.trailers);
							response.end(data);
							
						});	
						couchdbResponse2.on("error", function(err) {
							console.log('reqeust2 error:'+ err);
						});
					});//couchdbRequest2
					
				});//replication  responseListener
			}); //http.request
			//repreq.write('{"source":"http://registry.npmjs.org/", "target":"npm-mirror", "doc_ids":["10ctl"], "connection_timeout": 60000, "retries_per_request": 20, "http_connections": 30}');
			var json_replication_string = '{"source":"'+registry_URL+'", "target":"'+db_cached+'", "doc_ids":["'+resource_path+'"]}';
			repreq.write(json_replication_string);
			repreq.end();
			
			//req.on('error', function(e) {
			//  console.log('problem with request: ' + e.message);
			//});
			//};
			//}//mode_cached == true
		});//couchdbRequest
		request.on("data", couchdbRequest.write.bind(couchdbRequest)); 
		request.on("end", couchdbRequest.end.bind(couchdbRequest)); 
	//}
}).listen(npm_proxy_server_port);
/*
nps.on('error', function(err) {
	  // handle async errors here
	console.log('ERROR: '+JSON.stringify(err));
});
*/
nps.on('close', function(err) {
	console.log('NPS server is closed');
});

// added by jacky
process.on('uncaughtException', function(err){
	console.log("ERROR:"+JSON.stringify(err.stack,null,4));
	return false;
});
//http.on('error(http)', function(err) {
//	  // handle async errors here
//	console.log('ERROR: '+JSON.stringify(err));
//});

console.log(npm_proxy_server_name+' running at http://'+npm_proxy_server_URL+':'+npm_proxy_server_port+'/ ');
console.log('Go to http://'+npm_proxy_server_URL+':'+npm_proxy_server_port+'/hello to see current configuration.\n');
