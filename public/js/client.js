
var user_name = prompt("Please enter your name");
if (user_name == null || user_name == '') user_name = "Todd Howard";

$('#message_name').val(user_name);
$('#message_input').focus();

$(function () {
  
  var socket = null;
  if (window.location.href.startsWith("http://localhost")) {
    socket = io();
  } else {
    socket = io.connect('http://vps.wroblewskipiotr.pl:8000');
  }

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
          $('<span class="single-message-date">').text(" "+msg.date))
      )
      .append( 
        $('<div class="single-message-text">').text(msg.msg))
    );
    $('.messages-div').scrollTop( $('#chat-div')[0].scrollHeight );
  }
    
  var showOnConsole = function(msg) {
    $('#console-p').append(msg+"<br>");
    $('#console-p').scrollTop($('#console-p')[0].scrollHeight);
  };

  $('#submit-button').click(function() {
    if ($('#message_input').val() !== '') {
      socket.emit('chat send message', {name: $('#message_name').val(), msg: $('#message_input').val(), date: getParsedDate()});
      $('#message_input').val('');
    }
    return false;
  });

  socket.on('chat message', function(message) {
    addNewMessage(message);
  });

  socket.on('new connection', function(data) {
    for (var i = 0; i < data.history.length; i++) {
      addNewMessage(data.history[i]);
    }
    socket.emit('new user registered', {name: $('#message_name').val(), id: data.id});
  });

  socket.on('update list', function(user) {
    if (user.newuser) addNewMessage({name: 'serwer', msg: 'Do czatu dołączył/-a '+user.name, date: getParsedDate()});
    $('#users-list').html('');
    user.list.forEach(e => {
      document.getElementById('users-list').innerHTML 
        += ('<li style="cursor:pointer" onclick="document.getElementById(\'message_input\').value = \'/'+e.name+': \'">' + e.name +'</li>');
    });
  });

  socket.on('user disconnected', function(msg) {
    addNewMessage({name: 'serwer', msg: msg, date: getParsedDate()});
  });
});