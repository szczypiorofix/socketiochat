function nofifyMe(n) {
    var options = {
        body: n.msg,
        icon: 'icon.png',
    }
    var notification = new Notification(n.name, options);
    setTimeout(notification.close.bind(notification), 2000);
}

function browserNotification(n) {
    
    if (document.visibilityState == "hidden") {
        
          // set the initial state (but only if browser supports the Page Visibility API)
          if( document[hidden] !== undefined )
            onchange({type: document[hidden] ? "blur" : "focus"});
        


        if (!("Notification" in window)) {
            alert("This browser does not support system notifications");
        }
        else if (Notification.permission === "granted") {
            nofifyMe(n);
        }
        else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                nofifyMe(n);
            }
        });
        }
    }
  }