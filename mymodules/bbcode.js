exports.bbcode = {
    emoji: [
        {name: 'smile', code: '&#x1F601;'},
        {name: 'smile_tears', code: '&#x1F602;'},
        {name: 'rotfl', code: '&#x1F923;'},
        {name: 'grinningbig', code: '&#x1F603;'},
        {name: 'grinningsmile', code: '&#x1F604;'},
        {name: 'grinningsweat', code: '&#x1F605;'},
        {name: 'grinningsquint', code: '&#x1F606;'},
        {name: 'wink', code: '&#x1F609;'},
        {name: 'sunglasses', code: '&#x1F60E;'},
        {name: 'facefood', code: '&#x1F60B;'},
        {name: 'kiss', code: '&#x1F618;'}
    ],
    
    create: function(text) {
        let newtext;
    
        // PROSTY FORMAT TEKSTU
        newtext = text.replace(/\[b\](.+?)\[\/b]/gi, "<b>$1</b>");
        newtext = newtext.replace(/\[i\](.*?)\[\/i]/gi, "<i>$1</i>");
        newtext = newtext.replace(/\[u\](.*?)\[\/u]/gi, "<u>$1</u>");
        newtext = newtext.replace(/\[s\](.*?)\[\/s]/gi, "<s>$1</s>");
    
        //OBRAZEK BEZ TEKSTU ALT
        newtext = newtext.replace(/\[img\](.*?)\[\/img]/gi, "<img src='$1' alt='' />");
    
        //OBRAZEK Z TEKSTEM ALT
        newtext = newtext.replace(/\[img=(.*?)\](.*?)\[\/img]/gi, "<img src='$1' alt='$2' />");
        
        //odnośnik www bez opisu - nie dodaje http
        newtext = newtext.replace(/\[url\](http.*?)\[\/url]/gi, "<a href='$1'>$2</a>");
    
        //odnośnik www z opisem - nie dodaje http
        newtext = newtext.replace(/\[url=(http.*?)\](.*?)\[\/url]/gi, "<a href='$1' target='_blank'>$2</a>");
    
        //odnośnik www - dodaje http
        newtext = newtext.replace(/\[url\](.*?)\[\/url]/gi, "<a href='http://$1'>$1</a>");
    
        //odnośnik www - dodaje http
        newtext = newtext.replace(/\[url=(.*?)\](.*?)\[\/url]/gi, "<a href='http://$1'>$2</a>");
    
        // cytat bez autora
        newtext = newtext.replace(/\[quote\](.*?)\[\/quote]/gi,'<blockquote class="cytat">$1</blockquote>');
        // cytat z autorem
        newtext = newtext.replace(/\[quote=(.*?)\](.*?)\[\/quote]/gi,'<p><cite>$1</cite> napisał(-a):</p><blockquote>$2</blockquote>');
        //kod
        newtext = newtext.replace(/\[code\](.*?)\[\/code]/gi,'<pre>$1</pre>');
        //kolory tekstu
        newtext = newtext.replace(/\[color=(.*?)\](.*?)\[\/color]/gi,'<font color=$1>$2</font>');
        //wielkosc tekstu
        newtext = newtext.replace(/\[size=(.*?)\](.*?)\[\/size]/gi,'<font size="$1">$2</font>');
        
    
        //FONT-AWESOME! DEFAULT SIZE
        newtext = newtext.replace(/\[fa\](.*?)\[\/fa]/gi,'<i class="fa fa-$1" aria-hidden="true"></i>');

        //FONT-AWESOME! LARGE (x33%) SIZE
        newtext = newtext.replace(/\[falg\](.*?)\[\/falg]/gi,'<i class="fa fa-$1 fa-lg" aria-hidden="true"></i>');
    
        //FONT-AWESOME! 2x SIZE
        newtext = newtext.replace(/\[fa2x\](.*?)\[\/fa2x]/gi,'<i class="fa fa-$1 fa-2x" aria-hidden="true"></i>');
    
        //FONT-AWESOME! 3x SIZE
        newtext = newtext.replace(/\[fa3x\](.*?)\[\/fa3x]/gi,'<i class="fa fa-$1 fa-3x" aria-hidden="true"></i>');
    
        //FONT-AWESOME! 4x SIZE
        newtext = newtext.replace(/\[fa4x\](.*?)\[\/fa4x]/gi,'<i class="fa fa-$1 fa-4x" aria-hidden="true"></i>');
    
        //FONT-AWESOME! 5x SIZE
        newtext = newtext.replace(/\[fa5x\](.*?)\[\/fa5x]/gi,'<i class="fa fa-$1 fa-5x" aria-hidden="true"></i>');
    
    
        //EMOJI
        this.emoji.forEach(function(element, index, array) {
            var re = RegExp(':'+element.name+':', 'g');
            newtext = newtext.replace(re, '<span>'+element.code+'</span>');
        });
        return newtext;
    }
};