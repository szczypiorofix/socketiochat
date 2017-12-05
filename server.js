var PORT = 8000;

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var favicon = require('serve-favicon');

var user_sockets = new Array();
var users = new Array();


Array.prototype.diff = function(a) {
  return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// TODO - zamienić w kliencie .text() na .html() albo poprawić escapeHtml
// TODO - strumieniowe przesyłanie muzyki
// TODO - dodać historię np. 20-30 ostatnich wiadomości


// USING STATIC CSS & JS FILEs

app.use('/', express.static(path.join(__dirname + '/public')));
app.use('/', express.static(path.join(__dirname + '/public/js')));
app.use('/', express.static(path.join(__dirname + '/public/css')));

// FAVICON
app.use(favicon(path.join(__dirname, 'public', 'icon.png')))


app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});


var onConnect = function(socket) {

 // ############ NEW CONNECTION ##########
 socket.emit('new connection', socket.id); 

 // ############ USER REGISTER/UNREGISTER ##########
 socket.on('new user registered', function(user) {
  console.log('New user registered! Name: '+user.name +" id: " +user.id);
  users.push(user);
  user_sockets.push({name: user.name, socket: socket});
  //console.log(user_sockets);
  io.sockets.emit('update list', {name: user.name, list: users, newuser: true});
  console.log(users);
  });

  socket.on('disconnect', function() {
    // AKTUALNA LISTA GNIAZDEK
/*     Object.keys(io.sockets.sockets).forEach(function(id) {
      console.log("ID:",id)  // socketId
    }) */
    var users_id_list = Object.keys(io.sockets.sockets);
    var user_disconnected_id = '';
    var user_disconnected_name = '';

    var temp = new Array();
    for (var i = 0; i < users.length; i++) {
      temp.push(users[i].id);
    }

    user_disconnected_id = temp.diff(users_id_list);

    var temp = new Array();
    for (var i = 0; i < users.length; i++) {
      if (users[i].id != user_disconnected_id[0]) temp.push(users[i]);
      else user_disconnected_name = users[i].name;
    }

    console.log('Disconnected ' +user_disconnected_name +", id: " +user_disconnected_id);
    io.sockets.emit('user disconnected', 'User ' +user_disconnected_name +' has disconnected!');
    io.sockets.emit('update list', {name: '', list: temp, newuser: false});
    users = temp;
  });



  // ############ SEND/RECEIVE MESSAGES ##########
  // USER MESSAGE
  socket.on('chat send message', function(msg) {
    io.sockets.emit('chat message', escapeHtml(msg));
  });

  // USER NAME
  socket.on('chat send name', function(name) {
    io.sockets.emit('chat name', escapeHtml(name));
  });
};



io.on('connection', onConnect);

http.listen(PORT, function() {
  console.log('listening on *:'+PORT);
});
