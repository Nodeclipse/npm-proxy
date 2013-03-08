// Util to request replication from one CouchDB database to an other
// by Paul Verest, March 2013

//configuration
var registry_URL = "http://isaacs.iriscouch.com/registry/";
var db_mirror = "npm_cashed"; // ! no '/'
var resource_path = "scripted";

var options = {
  hostname: 'localhost',
  port: 5984,
  path: '/_replicate',
  method: 'POST',
  headers: { 'content-type': 'application/json' }
};

var json_replication_string = '{"source":"'+registry_URL+'", "target":"'+db_mirror+'", "doc_ids":["'+resource_path+'"]}';
console.log('Equivalent: curl -X ' + options.method 
		+' '+options.hostname+':'+options.port+options.path
		+" -d '"+ json_replication_string+"'"
		+' -H "Content-Type:application/json"'
);

//imports
var http = require("http");

//main
var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
  res.on('end', function (anything) {
	console.log('res end. ');
  });
});

//req.on('error', function(e) {
//  console.log('problem with request: ' + e.message);
//});

req.write(json_replication_string);
//req.write('{"source":"http://registry.npmjs.org/", "target":"npm-mirror", "doc_ids":["10ctl"], "connection_timeout": 60000, "retries_per_request": 20, "http_connections": 30}');
req.end();

// ----------------------------- THE END -----------------------------  

//http://nodejs.org/api/http.html#http_http_request_options_callback

//'curl -X POST -H "Content-Type:application/json" http://192.168.56.101:5984/_replicate -d '{"source":"http://isaacs.iriscouch.com/registry/", "target":"registry", "doc_ids":["testmod","underscore","mongodb"]}'' 
///_replicate -d '{"source":"http://isaacs.iriscouch.com/registry/", "target":"registry", "doc_ids":["testmod","underscore","mongodb"]}'

//curl -X POST -H "Content-Type:application/json" http://localhost:5984/_replicate -d '{"source":"http://registry.npmjs.org/", "target":"npm-mirror", "doc_ids":["10ctl"]}'

//$ node request-to-replicate.js
//STATUS: 500
//HEADERS: {"server":"CouchDB/1.2.1 (Erlang OTP/R14B04)","date":"Mon, 04 Mar 2013
//09:36:28 GMT","content-type":"text/plain; charset=utf-8","content-length":"32","
//cache-control":"must-revalidate"}
//BODY: {"error":"changes_reader_died"}

//http://wiki.apache.org/couchdb/Replication
//http://localhost:5984/_active_tasks

//http://stackoverflow.com/questions/8156594/couchdb-filtered-replication-amend-doc-id-after-first-complete-replication

//Successful:	
//
//	curl -X PUT http://localhost:5984/registry01
//	curl -X POST http://localhost:5984/_replicate -d '{"source":"http://isaacs.iriscouch.com/registry/", "target":"registry01"}' -H "Content-Type:application/json"

//	curl -X PUT http://localhost:5984/registry02
//	curl -X POST http://localhost:5984/_replicate -d '{"doc_ids":["10tcl"], "source":"http://isaacs.iriscouch.com/registry/", "target":"registry02"}' -H "Content-Type:application/json"
//curl -X POST http://localhost:5984/_replicate -d '{"doc_ids":["underscore"], "source":"http://isaacs.iriscouch.com/registry/", "target":"registry02"}' -H "Content-Type:application/json"

//curl -X POST http://localhost:5984/_replicate -d '{"doc_ids":["underscore"], "source":"http://isaacs.iriscouch.com/registry/", "target":"npm-mirror"}' -H "Content-Type:application/json"

