const fs = require('fs');
const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

const httpServer = http.createServer(function (req, res) {
    unifiedServer(req, res);
});

httpServer.listen(3000, function () {
    console.log('Server is running on port: ' + 3000);
});

const unifiedServer = function (req, res) {
    var parsedUrl = url.parse(req.url, true);
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    var headers = req.headers;
    var buffer = '';

    var queryStringObject = parsedUrl.query;

    var method = req.method.toLowerCase();  //headers
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });
    req.on('end', function () {
        var chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        chosenHandler(data, function (statusCode, payload) {
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
            payload = typeof (payload) == 'object' ? payload : { msg: "Welcome to my API!" };

            var payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log('Returning the response: ', statusCode, payloadString);
        });
    });
};


const handlers = {};
handlers.hello = function (data, callback) {
    callback(200, { message: "Welcome to my API!" });
}

handlers.notFound = function (data, callback) {
    callback(404);
};

var router = {
    'hello': handlers.hello
}
