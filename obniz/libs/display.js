
Display = function(Obniz) {
  this.Obniz = Obniz;
};

Display.prototype.clear = function() {
  var obj = {};
  obj["display"] = {
    clear: true
  };
  this.Obniz.send(obj);
};

Display.prototype.print = function(text) {
  var obj = {};
  obj["display"] = {
    text: ""+text
  };
  this.Obniz.send(obj);
};

Display.prototype.qr = function(data, correction) {
  var obj = {};
  obj["display"] = {
    qr: {
      data: data
    }
  };
  if (correction) {
    obj["display"].qr.correction = correction;
  }
  this.Obniz.send(obj);
};