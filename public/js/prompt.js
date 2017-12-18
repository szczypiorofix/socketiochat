
var emoji = null;

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var emoji = JSON.parse(this.responseText);
        emojiList.emojis = emoji;
    }
};
xmlhttp.open("GET", "http://localhost/json", true);
xmlhttp.send();
