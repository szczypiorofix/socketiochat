
var user_name = prompt("Please enter your name");
if (user_name == null || user_name == '') user_name = "Todd Howard";

$('#message_name').text(user_name);
$('#message_input').focus();


Vue.component('user-list-item', {
  props: ['user'],
  template: '<li>{{ user.name }}</li>'
});

Vue.component('emoji-list-item', {
  props: ['e'],
  template: '<span>:{{ e.name }}: <span v-html="e.code"></span>, </span>'
});

var vueUsersList = new Vue({
  el: '#vue-users-list',  
  data: {
    users: []
  }
});

var emojiList = new Vue({
  el: '#form-div-vue',
  data: {
    emojis: [],
    emojiToView: '',
    showEmojiDiv: false,
    emojiToFilter: ''
  },
  methods: {
    filterEmojis: function(f) {
      // IF METHOD FILTER IS NOT AVAILABLE
      if (!Array.prototype.filter)
      {
        Array.prototype.filter = function(fun /*, thisp*/)
        {
          var len = this.length;
          if (typeof fun != "function")
            throw new TypeError();

          var res = [];
          var thisp = arguments[1];
          for (var i = 0; i < len; i++)
          {
            if (i in this)
            {
              var val = this[i]; // in case fun mutates this
              if (fun.call(thisp, val, i, this))
                res.push(val);
            }
          }
          return res;
        };
      }

      function filterEmoji(s) {
        return emojiList.emojis.filter(function (element, index, array) {
          return (element.name.indexOf(s) >= 0);
        });
      }

      function isAlphaNumericKey(k) {
        if (k.length > 1) return false;
        return true;
      }
      
      if (isAlphaNumericKey(f.key)) {
        
        if (f.key === ':') emojiList.showEmojiDiv = true;
        if (f.key === ' ') {
          emojiList.showEmojiDiv = false;
          emojiList.emojiToFilter = '';
        }

        if (emojiList.showEmojiDiv) {
          if (f.key !== ':') emojiList.emojiToFilter += f.key;
          for (var i = 0; i < emojiList.emojis.length; i++) {
            if ($('#message_input').text().indexOf(emojiList.emojis[i].name) >= 0) {
              console.log(emojiList.emojis[i].name);
              emojiList.emojiToView = filterEmoji(f.key);
            }
          }
        }
        
        emojiList.lastKey = f.key;
        
        //emojiList.emojiToView = filterEmoji(f.key);
        //console.log(emojiList.emojiToView);
        
      } else {
        if (f.key === 'Enter') {
          emojiList.showEmojiDiv = false;
          emojiList.emojiToFilter = '';
          console.log('Clear ...');
        }
        if (f.key === 'Backspace') {
          emojiList.emojiToFilter = emojiList.emojiToFilter.substring(0, emojiList.emojiToFilter.length - 1);
          if ($('#message_input').text().endsWith(':')) {
            console.log('Koniec!');
            emojiList.showEmojiDiv = false;
            emojiList.emojiToFilter = '';
          }
        }
      }
      console.log('Show emoji? : '+emojiList.showEmojiDiv);
      if (emojiList.showEmojiDiv) console.log('Emoji filter: '+emojiList.emojiToFilter);
    }
  }
});

$(function () {

  var socket = null;
  if (window.location.href.startsWith("http://localhost")) {
    socket = io();
  } else {
    socket = io.connect('https://chat.wroblewskipiotr.pl:80');
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
        $('<div class="single-message-text">').html(msg.msg))
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

  socket.on('update list', function(dataFromServer) {
    if (dataFromServer.newuser) {
      addNewMessage({name: 'serwer', msg: 'Do czatu dołączył/-a '+dataFromServer.name, date: getParsedDate()});
    }
    vueUsersList.users = dataFromServer.list;
  });

  socket.on('user disconnected', function(msg) {
    addNewMessage({name: 'serwer', msg: msg, date: getParsedDate()});
  });
});