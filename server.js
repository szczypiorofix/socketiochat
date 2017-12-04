var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var favicon = require('serve-favicon');
var port = 8000;


// USING STATIC CSS & JS FILEs
app.use(express.static('public/css'));
app.use(express.static('public/js'));


// FAVICON
app.use(favicon(path.join(__dirname, 'public', 'icon.png')))


app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});


var users = Array();


var onConnect = function(socket) {
 // NEW USER CONNECTED
  
 socket.emit('new connection', socket.id);
  
 io.sockets.emit('update users list', users);
 
  // USER MESSAGE
  socket.on('chat message', function(msg) {
    io.sockets.emit('chat message', msg);
  });

  // USER NAME
  socket.on('chat name', function(name) {
    io.sockets.emit('chat name', name);
  });

  socket.on('new user registered', function(user) {
    console.log('New user registered! Name: '+user.name +" id: " +user.id);
    users.push(user);
    //console.log(users);
    io.sockets.emit('update users list', users);
  });

  socket.on('disconnect', function() {
    var clients = io.sockets.clients();
    var users_id_list = Object.keys(clients.connected);
    var cutting = false;
    var user_disconnected = null;
    for (var i = 0; i < users_id_list.length; i++) {
      for (var j = 0; j < users.length; j++) {
        if (users[j].id !== users_id_list[i] && !cutting) {
          user_disconnected = users[j].name;
          users.splice(j, 1);
          cutting = true;
        }
      }
    }
    console.log(users);
    //io.sockets.emit('user disconnected', 'User ' +user_disconnected +' has disconnected!');
    //io.sockets.emit('update users list', users);
  });
};


io.on('connection', onConnect);


http.listen(port, function() {
  console.log('listening on *:'+port);
});
