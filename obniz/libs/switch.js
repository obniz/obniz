
ObnizSwitch = function(Obniz) {
  this.Obniz = Obniz;
  this.observers = [];
};

ObnizSwitch.prototype.addObserver = function(callback) {
  if(callback) {
    this.observers.push(callback);
  }
};

ObnizSwitch.prototype.getWait = function() {
  var self = this;
  return new Promise(function(resolve, reject){
    var obj = {};
    obj["switch"] = "get";
    self.Obniz.send(obj);
    self.addObserver(resolve);
  });
};

ObnizSwitch.prototype.notified = function(obj) {
  this.state = obj.state;
  if (this.onchange) {
    this.onchange(this.state);
  }
  var callback = this.observers.shift();
  if (callback) {
    callback(this.state);
  }
};