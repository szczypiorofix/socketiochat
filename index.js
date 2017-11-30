var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 80;


// USING STATIC CSS & JS FILEs
app.use(express.static('css'));
app.use(express.static('js'));


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){  
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('chat name', function(name){
    io.emit('chat name', name);
  });
});

http.listen(port, function(){
  console.log('listening on *:'+port);
});