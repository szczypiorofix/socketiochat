
var emoji = null;

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var emoji = JSON.parse(this.responseText);
        emojiList.emojis = emoji;
        
        console.log(emojiList.emojis);

        /* $('#message_input').keypress(function(e) {
            if (e.which === 58 && emoji != null) {
                var t = '<span>';
                for (var key in emoji) {
                    if (emoji.hasOwnProperty(key)) {
                        t += ':'+key+': '+emoji[key]+', ';
                    }
                }
                t += '</span>';
                $('#prompt-area').html(t);
            }
            else {
                $('#prompt-area').text('');
            }
        }); */
    }
};
xmlhttp.open("GET", "http://localhost/json", true);
xmlhttp.send();
