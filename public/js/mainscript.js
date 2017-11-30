
var user_name = prompt("Please enter your name");
if (user_name == null || user_name == '') user_name = "Todd Howard";

$('#message_name').val(user_name);
$('#message_input').focus();

$(function () {
  var socket = io();
  $('form').submit(function() {
    socket.emit('chat name', $('#message_name').val());
    socket.emit('chat message', $('#message_input').val());
    $('#message_input').val('');
    return false;
  });

  socket.on('chat name', function(name) {
    $('#names').append($('<li>').text(name));
    $('#console-p').append(name+" is typing: ");
  });

  var showOnConsole = function(msg) {
    $('#console-p').append(msg+"<br>");
    $('#console-p').scrollTop($('#console-p')[0].scrollHeight);
  };

  socket.on('chat message', function(msg) {
    $('#messages').append($('<li>').text(msg));    
    $('#messages-div-id').scrollTop($('#messages-div-id')[0].scrollHeight);
    showOnConsole(msg);
  });

  socket.on('new connection', function(msg) {
    socket.emit('new user name', $('#message_name').val());
  });

  socket.on('new user name all', function(name) {
    showOnConsole("New user connected: " +name);
  });

/*   socket.on('disconnect a user', function(msg) {
    socket.emit('disconect particular user', $('#message_name').val());
  });

  socket.on('disconnect particular user name', function(name) {
    showOnConsole("User " +name +" has disconnected.");
  }) */

});