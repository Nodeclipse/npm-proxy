
// http://nodejs.org/api/http.html#http_http_request_options_callback

// create DB from command line
// curl -X PUT http://localhost:5984/registry


var http = require("http");

var options = {
  hostname: 'localhost',
  port: 5984,
  path: '/registry0',
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

//req.on('error', function(e) {
//  console.log('problem with request: ' + e.message);
//});

req.end();