
var user_name = prompt("Please enter your name");
if (user_name == null || user_name == '') user_name = "Todd Howard";

$('#message_name').val(user_name);
$('#message_input').focus();

$(function () {
  
  var socket = io.connect('http://localhost:8000');

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

  socket.on('new connection', function(id) {
    showOnConsole('Welcome officer! Your ID: ' +id);
    socket.emit('new user registered', {name: $('#message_name').val(), id: id});
  });

  socket.on('update users list', function(l) {
    //showOnConsole('Users list updated!');
    //console.log(l);
    $('#users-list').text('');
    l.forEach(e => {
      $('#users-list').append($('<li>').text(e.name));
      $('li').css('cursor', 'pointer')
      
          .click(function() {
              window.location = $('a', '#').attr('href');
              return false;
          });
    });
  });

  socket.on('user disconnected', function(msg) {
    showOnConsole(msg);
  });
});