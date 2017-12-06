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
    dataU: [],
    dataM: [],
    get: function() {
      let temp = [];
      for (var i = this.length-1; i >= 0; i--) {
        temp[this.length - i -1] = {u: this.dataU[i], m: this.dataM[i]};
      }
      return temp;
    },
    putMsg: function(m) {
      let temp = new Array();
      for (var i = 1; i < this.length; i++) {
        temp[i] = this.dataM[i-1];
      }
      temp[0] = m;
      this.dataM = temp;
    },
    putName: function(n) {
      let temp = new Array();
      if (this.length < this.maxlength) this.length++;
      for (var i = 1; i < this.length; i++) {
        temp[i] = this.dataU[i-1];
      }
      temp[0] = n;
      this.dataU = temp;
    }
  };