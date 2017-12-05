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

function getParsedDate() {
  function leadingZero(i) {
    return (i < 10)? '0'+i : i;
  }
  let months = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", 'Lipiec', "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
  let d = new Date();
  return leadingZero(
  leadingZero(d.getDate()) 
  +" "+months[d.getMonth()]
  +" "+d.getFullYear()
  +" "+leadingZero(d.getHours()))
  +":"+leadingZero(d.getMinutes())
  +":"+d.getSeconds()+", ";
}

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

// TODO - strumieniowe przesyłanie muzyki
// TODO - dodać historię np. 20-30 ostatnich wiadomości

var history = {
  length: 0,
  maxlength: 20,
  dataU: [],
  dataM: [],
  get: function() {
    let temp = [];
    for (var i = this.length-1; i >= 0; i--) {
      temp[this.length - i -1] = {u: this.dataU[i], m: this.dataM[i]};
    }
    return temp;
  },
  putMsg: function(m) {
    let temp = new Array();
    for (var i = 1; i < this.length; i++) {
      temp[i] = this.dataM[i-1];
    }
    temp[0] = m;
    this.dataM = temp;
  },
  putName: function(n) {
    let temp = new Array();
    if (this.length < this.maxlength) this.length++;
    for (var i = 1; i < this.length; i++) {
      temp[i] = this.dataU[i-1];
    }
    temp[0] = n;
    this.dataU = temp;
  }
};


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
 socket.emit('new connection', {id: socket.id, history: history.get()}); 

 // ############ USER REGISTER/UNREGISTER ##########
 socket.on('new user registered', function(user) {
  console.log(getParsedDate() +'New user registered! Name: '+user.name +" id: " +user.id);
  users.push(user);
  user_sockets.push({name: user.name, socket: socket});
  //console.log(user_sockets);
  io.sockets.emit('update list', {name: user.name, list: users, newuser: true});
  //console.log(users);
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

    console.log(getParsedDate() +'Disconnected ' +user_disconnected_name +", id: " +user_disconnected_id);
    io.sockets.emit('user disconnected', 'User ' +user_disconnected_name +' has disconnected!');
    io.sockets.emit('update list', {name: '', list: temp, newuser: false});
    users = temp;
  });



  // ############ SEND/RECEIVE MESSAGES ##########
  // USER MESSAGE
  socket.on('chat send message', function(msg) {
    history.putMsg(msg);
    io.sockets.emit('chat message', escapeHtml(msg));
  });

  // USER NAME
  socket.on('chat send name', function(name) {
    history.putName(name);
    io.sockets.emit('chat name', escapeHtml(name));
  });
};



io.on('connection', onConnect);

http.listen(PORT, function() {
  console.log(getParsedDate() +'Server start. Listening on *:'+PORT);
});
