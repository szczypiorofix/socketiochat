var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var favicon = require('serve-favicon');
var port = 80;


// USING STATIC CSS & JS FILEs
app.use(express.static('/public/css'));
app.use(express.static('/public/js'));

app.use(favicon(path.join(__dirname, '', 'public/icon.png')))

//app.use(express.favicon("icon.pngt")); 

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket) {
  //console.log(socket);
  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });
  socket.on('chat name', function(name) {
    io.emit('chat name', name);
  });
});

http.listen(port, function() {
  console.log('listening on *:'+port);
});
