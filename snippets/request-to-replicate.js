
// http://nodejs.org/api/http.html#http_http_request_options_callback

// 'curl -X POST -H "Content-Type:application/json" http://192.168.56.101:5984/_replicate -d '{"source":"http://isaacs.iriscouch.com/registry/", "target":"registry", "doc_ids":["testmod","underscore","mongodb"]}'' 
// /_replicate -d '{"source":"http://isaacs.iriscouch.com/registry/", "target":"registry", "doc_ids":["testmod","underscore","mongodb"]}'

// curl -X POST -H "Content-Type:application/json" http://localhost:5984/_replicate -d '{"source":"http://registry.npmjs.org/", "target":"npm-mirror", "doc_ids":["10ctl"]}'

// http://wiki.apache.org/couchdb/Replication
// http://localhost:5984/_active_tasks

// http://stackoverflow.com/questions/8156594/couchdb-filtered-replication-amend-doc-id-after-first-complete-replication



var http = require("http");

var options = {
  hostname: 'localhost',
  port: 5984,
  path: '/_replicate',
  method: 'POST',
  headers: { 'content-type': 'application/json' }
};

var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

//req.on('error', function(e) {
//  console.log('problem with request: ' + e.message);
//});

req.write('{"source":"http://registry.npmjs.org/", "target":"npm-mirror", "doc_ids":["10ctl"]}');
//req.write('{"source":"http://registry.npmjs.org/", "target":"npm-mirror", "doc_ids":["10ctl"], "connection_timeout": 60000, "retries_per_request": 20, "http_connections": 30}');
req.end();



//$ node request-to-replicate.js
//STATUS: 500
//HEADERS: {"server":"CouchDB/1.2.1 (Erlang OTP/R14B04)","date":"Mon, 04 Mar 2013
//09:36:28 GMT","content-type":"text/plain; charset=utf-8","content-length":"32","
//cache-control":"must-revalidate"}
//BODY: {"error":"changes_reader_died"}
