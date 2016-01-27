var unfluff =  require('./unfluff')
var cheerio =  require('cheerio')

var textdata;
var textdata2
var fs = require('fs') ,
  filename = 'result.html'
  filename2 = 'result2.html'
fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    textdata = data
     $=cheerio.load(textdata)
    console.log($('p, pre, td').length)
});

fs.readFile(filename2, 'utf8', function(err, data) {
    if (err) throw err;
    textdata2 = data

    $=cheerio.load(textdata2)
    console.log($('p, pre, td').length)
});

//Lets require/import the HTTP module
var http = require('http');

//Lets define a port we want to listen to
const PORT = 8080;

//We need a function which handles requests and send response
function handleRequest(request, response) {
    response.end(JSON.stringify([unfluff(textdata),unfluff(textdata2)] ));
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function() {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
