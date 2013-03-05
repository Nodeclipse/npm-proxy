// http://stackoverflow.com/questions/10222216/implementing-a-simple-proxy-server-using-node-js

// try with http://localhost:8484/resource/http://code.jquery.com/jquery.js

var url = require("url");
var http = require("http");
var https = require("https");

http.createServer(function (request, response) {
    var path = url.parse(request.url).path;

    if (!path.indexOf("/resource/")) {
        var protocol;
        path = path.slice(10); 		// /resource/
        var location = url.parse(path);

        switch (location.protocol) {
        case "http:":
            protocol = http;
            break;
        case "https:":
            protocol = https;
            break;
        default:
            response.writeHead(400);
            response.end();
            return;
        }

        var options = {
            host: location.host,
            hostname: location.hostname,
            port: +location.port,
            method: request.method,
            path: location.path,
            headers: request.headers,
            auth: location.auth
        };

        
        delete options.headers.host;
        var clientRequest = protocol.request(options, function (clientResponse) {
            response.writeHead(clientResponse.statusCode, clientResponse.headers);
            clientResponse.on("data", response.write.bind(response)); //response.write
            clientResponse.on("end", function () {
                response.addTrailers(clientResponse.trailers);
                response.end();
            });
        });

        request.on("data", clientRequest.write.bind(clientRequest) ); //clientRequest.write
        request.on("end", clientRequest.end.bind(clientRequest) ); 	//clientRequest.end
    } else {
        response.writeHead(404);
        response.end();
    }
}).listen(8484);
console.log('Server running at http://127.0.0.1:8484/');