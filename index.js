var http = require('http');
var fs = require('fs');
var url = require("url");
var chatHistory = [];
var socketio = require("socket.io");
var userArray = [];
var server = http.createServer((req, res)=>{
    console.log(req.url);
    if(req.url == '/'){
        fs.readFile('index.html', 'utf-8', (error, data)=>{
            if(error){
                res.writeHead(500, {'content-type': 'text/html'});
                res.end('Internal Server Error');
            }else {
                res.writeHead(200, {'content-type': 'text/html'});
                res.end(data);
            }
        });
    }
    else if (req.url == '/style.css'){
        fs.readFile('style.css', (error, data)=>{
            if(error){
                res.writeHead(500, {'content-type': 'text/html'});
                res.end('Internal Server Error');
            }else {
                res.writeHead(200, {'content-type': 'text/css'});
                res.end(data);
            }
        });
    }else if (req.url == '/script.js'){
        fs.readFile('script.js', (error, data)=>{
            if(error){
                res.writeHead(500, {'content-type': 'text/html'});
                res.end('Internal Server Error');
            }else {
                res.writeHead(200, {'content-type': 'text/javascript'});
                res.end(data);
            }
        });
    }else if (req.url == '/imgs/bg.jpg'){
        fs.readFile('/imgs/bg.jpg', (error, data)=>{
            res.writeHead(200, {'content-type': 'image/jpg'});
            res.end(data);
        });
    }else if(req.url == '/config.js'){
        fs.readFile('config.js', (error, data)=>{
            res.writeHead(200, {'content-type': 'text/javascript'});
            res.end(data);
        });
    }
});

var io = socketio.listen(server);
io.sockets.on('connect', (socket)=>{
    io.sockets.emit('chatHistory', chatHistory);
    socket.on('disconnect', ()=>{
        var index = userArray.indexOf(socket.userName);
        if (index > -1){
            userArray.splice(index, 1);
        }
        io.sockets.emit('updateUserListToServer', userArray);
    })
    io.sockets.emit('userListToServer', userArray);
    socket.on('newNameToServer', (newUser)=>{
        // console.log(name + " just joined.");
        if (userArray.indexOf(newUser) <= -1){
            userArray.push(newUser);
            socket.userName = newUser;
            io.sockets.emit('newUser', newUser);
        }else {
            var extistingUserHTML = "You already entered the room"
            io.sockets.emit('existingUser', extistingUserHTML);
        }
    });
    socket.on('newMsgToServer', (msgObj)=>{
        if(chatHistory.length > 10){
            chaHistory.shift();
        }else {
            chatHistory.push(msgObj.currentUserName + " says " + msgObj.newMsg);
        }
        io.sockets.emit('newMessage', msgObj.currentUserName + " says " + msgObj.newMsg);
    })

});

server.listen(8080);
console.log("The node file is working");
