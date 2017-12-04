
var user_name = prompt("Please enter your name");
if (user_name == null || user_name == '') user_name = "Todd Howard";

$('#message_name').val(user_name);
$('#message_input').focus();

$(function () {
  
  var socket = io.connect('http://vps.wroblewskipiotr.pl:8000');
    
  var showOnConsole = function(msg) {
    $('#console-p').append(msg+"<br>");
    $('#console-p').scrollTop($('#console-p')[0].scrollHeight);
  };

  $('form').submit(function() {
    socket.emit('chat send name', $('#message_name').val());
    socket.emit('chat send message', $('#message_input').val());
    $('#message_input').val('');
    return false;
  });

  socket.on('chat name', function(name) {
    $('#names').append($('<li>').text(name));
    $('#console-p').append(name+" is typing: ");
  });

  socket.on('chat message', function(msg) {
    $('#messages').append($('<li>').text(msg));    
    $('#messages-div-id').scrollTop($('#messages-div-id')[0].scrollHeight);
    showOnConsole(msg);
  });

  socket.on('new connection', function(id) {
    showOnConsole('Welcome officer! Your ID: ' +id);
    socket.emit('new user registered', {name: $('#message_name').val(), id: id});
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