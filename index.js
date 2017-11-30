var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var favicon = require('serve-favicon');
var port = 80;


// USING STATIC CSS & JS FILEs
app.use(express.static('public/css'));
app.use(express.static('public/js'));

// FAVICON
app.use(favicon(path.join(__dirname, 'public', 'icon.png')))

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

var usersArray = Array();

io.on('connection', function(socket) {
  // NEW USER CONNECTED
  io.emit('new connection', 'New user connected');
  
  // USER MESSAGE
  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
  });

  // USER NAME
  socket.on('chat name', function(name) {
    io.emit('chat name', name);
  });

  // NEW USER *** CONNECTED
  socket.on('new user name', function(name) {
    console.log('New user has connected! '+name);
    usersArray.push(name);
    console.log(usersArray);
    io.emit('new user name all', name);
  });

  socket.on('disconnect', function(s) {
    console.log('user disconnected.');
    
    //io.emit('disconnect a user', '');
  });

/*   socket.on('disconect particular user', function(name) {
    console.log('User '+name + ' has disconneced.');
    io.emit('disconnect particular user name', name);
  }); */
});

http.listen(port, function() {
  console.log('listening on *:'+port);
});
