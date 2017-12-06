
var user_name = prompt("Please enter your name");
if (user_name == null || user_name == '') user_name = "Todd Howard";

$('#message_name').val(user_name);
$('#message_input').focus();

$(function () {
  
  // VPS SERVER
  //var socket = io.connect('http://vps.wroblewskipiotr.pl:8000');

  // LOCALHOST
  var socket = io();

  var getParsedDate = function() {
    function leadingZero(i) {
      return (i < 10)? '0'+i : i;
    }
    let months = ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", 'lipiec', "sierpień", "wrzesień", "październik", "listopad", "grudzień"];
    let d = new Date();
    return d.getDate()
    +" "+(months[d.getMonth()])
    +" "+d.getFullYear()
    +" "+leadingZero(d.getHours())
    +":"+leadingZero(d.getMinutes())
    +":"+leadingZero(d.getSeconds());
  }

  var addNewMessage = function(msg) {
    $('#chat-div')
    .append( $('<div class="single-message">')
      .append( 
        $('<div class="single-message-name">').text("@" +msg.name)
      .append( 
        $('<span class="single-message-date">').text(" "+getParsedDate())))
      .append( 
        $('<div class="single-message-text">').text(msg.msg))
    );
  }
    
  var showOnConsole = function(msg) {
    $('#console-p').append(msg+"<br>");
    $('#console-p').scrollTop($('#console-p')[0].scrollHeight);
  };

  $('form').submit(function() {
    socket.emit('chat send message', {name: $('#message_name').val(), msg: $('#message_input').val()});
    $('#message_input').val('');
    return false;
  });

  socket.on('chat message', function(message) {
    addNewMessage(message);
  });

  socket.on('new connection', function(data) {
    showOnConsole('Welcome officer! Your ID: ' +data.id);
    for (var i = 0; i < data.history.length; i++) {
      $('#names').append($('<li>').text(data.history[i].u));
      $('#messages').append($('<li>').text(data.history[i].m));
    }
    socket.emit('new user registered', {name: $('#message_name').val(), id: data.id});
  });

  socket.on('update list', function(user) {
    if (user.newuser) showOnConsole('New user joined! '+user.name);
    $('#users-list').html('');
    user.list.forEach(e => {
      document.getElementById('users-list').innerHTML 
        += ('<li style="cursor:pointer" onclick="document.getElementById(\'message_input\').value = \'/'+e.name+': \'">' + e.name +'</li>');
    });
  });

  socket.on('user disconnected', function(msg) {
    showOnConsole(msg);
  });
});