
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

  socket.on('chat message', function(msg) {
    $('#messages').append($('<li>').text(msg));
    $('#console-p').append(msg+"<br>");
    $('#console-p').scrollTop($('#console-p')[0].scrollHeight);
    $('#messages-div-id').scrollTop($('#messages-div-id')[0].scrollHeight);
  });

});