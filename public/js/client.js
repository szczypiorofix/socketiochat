
var user_name = prompt("Please enter your name");
if (user_name == null || user_name == '') user_name = "Todd Howard";

$('#message_name').text(user_name);
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
    $('.message-div').scrollTop( $('#chat-div')[0].scrollHeight );
  }

  $('#message_input').keyup(function(e){
    if(e.keyCode == 13)
    {
      if ($('#message_input').val() !== '') {
        socket.emit('chat send message', {name: user_name, msg: $('#message_input').val(), date: getParsedDate()});
        $('#message_input').val('');
      }
    }
  });

  socket.on('chat message', function(message) {
    addNewMessage(message);
    if (message.name !== user_name) {
      BrowserNotification.show(message);
    }
  });

  socket.on('new connection', function(data) {
    for (var i = 0; i < data.history.length; i++) {
      addNewMessage(data.history[i]);
    }
    socket.emit('new user registered', {name: user_name, id: data.id});
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