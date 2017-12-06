exports.escapeHtml = function(text) {
    var map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

exports.history = {
    length: 0,
    maxlength: 20,
    data: [],
    get: function() {
      let temp = [];
      for (var i = this.length-1; i >= 0; i--) {
        temp[this.length - i -1] = {name: this.data[i].name, msg: this.data[i].msg, date: this.data[i].date};
      }
      return temp;
    },
    put: function(m) {
      let temp = new Array();
      if (this.length < this.maxlength) this.length++;
      for (var i = 1; i < this.length; i++) {
        temp[i] = this.data[i-1];
      }
      temp[0] = m;
      this.data = temp;
    }
  };