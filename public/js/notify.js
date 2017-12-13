
var BrowserNotification = {

    visible: true,

    nofifyMe: function(n) {
        var options = {
            body: n.msg,
            icon: 'icon.png',
        }
        if (!this.visible) {
            var notification = new Notification(n.name, options);
            setTimeout(notification.close.bind(notification), 2000);
        }
    },
    init: function() {
        // set the initial state (but only if browser supports the Page Visibility API)
        if (!("Notification" in window)) {
            alert("This browser does not support system notifications");
        }

        var self = this;
        setInterval(function() {
            if (document.hasFocus()) {
                self.visible = true;
            } else {
                self.visible = false;
            }
        }, 500);
    },
    show: function(m) {
        if (!("Notification" in window)) {
            alert("This browser does not support system notifications");
        }
        else if (Notification.permission === "granted") {
            this.nofifyMe(m);
        }
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                if (permission === "granted") {
                    this.nofifyMe(m);
                }
            });
        }
    }
}
