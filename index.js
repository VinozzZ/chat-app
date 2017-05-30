var http = require('http');
var fs = require('fs');

var server = http.createServer((req, res)=>{
    console.log("Someone connected the server")
})

server.listen(8000);
console.log("The node file is working");
