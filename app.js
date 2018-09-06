var PORT = 80;

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var fs = require('fs');
var favicon = require('serve-favicon');

var bbcode_module = require('./mymodules/bbcode');
var history_module = require('./mymodules/history');
var parseddate_module = require('./mymodules/parseddate');
var escapehtml_module = require('./mymodules/escapehtml');

var history = history_module.history;
var escapeHtml = escapehtml_module.escapeHtml;
var bbcode = bbcode_module.bbcode;
var getParsedDate = parseddate_module.getParsedDate;

var songName0 = 'song0.mp3';
var songFile0 = fs.statSync(songName0);
var songName1 = 'song1.mp3';
var songFile1 = fs.statSync(songName1);
var songName2 = 'song2.mp3';
var songFile2 = fs.statSync(songName2);
var songName3 = 'song3.mp3';
var songFile3 = fs.statSync(songName3);
var songName4 = 'song4.mp3';
var songFile4 = fs.statSync(songName4);

var user_sockets = new Array();
var users = new Array();

Array.prototype.diff = function(a) {
  return this.filter(function(i) {return a.indexOf(i) < 0;});
};


// USING STATIC CSS & JS FILEs
app.use('/', express.static(path.join(__dirname + '/public')));
app.use('/', express.static(path.join(__dirname + '/public/js')));
app.use('/', express.static(path.join(__dirname + '/public/css')));
app.use('/', express.static(path.join(__dirname + '/public/fonts')));
app.use('/', express.static(path.join(__dirname + '/public/images')));

// FAVICON
app.use(favicon(path.join(__dirname, 'public', 'icon.png')))


app.get('/?', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(bbcode.emoji);
});

// MUSICBOX
app.get('/musicbox/song0', function(request, response) {
    response.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': songFile0.size
    });
    fs.createReadStream(songName0).pipe(response);
});
app.get('/musicbox/song1', function(request, response) {
  response.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': songFile1.size
  });
  fs.createReadStream(songName1).pipe(response);
});
app.get('/musicbox/song2', function(request, response) {
  response.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': songFile2.size
  });
  fs.createReadStream(songName2).pipe(response);
});
app.get('/musicbox/song3', function(request, response) {
  response.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': songFile3.size
  });
  fs.createReadStream(songName3).pipe(response);
});
app.get('/musicbox/song4', function(request, response) {
  response.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': songFile4.size
  });
  fs.createReadStream(songName4).pipe(response);
});



var onConnect = function(socket) {

 // ############ NEW CONNECTION ##########
 socket.emit('new connection', {id: socket.id, history: history.get()}); 

 // ############ USER REGISTER/UNREGISTER ##########
 socket.on('new user registered', function(user) {
  console.log(getParsedDate() +'Nowy użytkownik: '+user.name +" id: " +user.id);
  users.push(user);
  user_sockets.push({name: user.name, socket: socket});
  io.sockets.emit('update list', {name: user.name, list: users, newuser: true});
  });

  socket.on('disconnect', function() {
    // CURRENT SOCKET LIST
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

    console.log(getParsedDate() +'Rozłączył się ' +user_disconnected_name +", id: " +user_disconnected_id);
    io.sockets.emit('user disconnected', 'Użytkownik ' +user_disconnected_name +' rozłączył się.');
    io.sockets.emit('update list', {name: '', list: temp, newuser: false});
    users = temp;
  });


  // ############ SEND/RECEIVE MESSAGES ##########
  socket.on('chat send message', function(message) {
    message.msg = bbcode.create(message.msg);
    history.put(message);
    io.sockets.emit('chat message', {name: escapeHtml(message.name), msg: message.msg, date: message.date});
  });
};


io.on('connection', onConnect);

http.listen(PORT, function() {
  console.log(getParsedDate() +'Start serwera. Port nasłuchu *:'+PORT);
});
