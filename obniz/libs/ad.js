
PeripheralAD = function(Obniz, id) {
  this.Obniz = Obniz;
  this.id = id;
  this.value = 0.0;
  this.observers = [];
};

PeripheralAD.prototype.addObserver = function(callback) {
  if(callback) {
    this.observers.push(callback);
  }
};

PeripheralAD.prototype.start = function(callback) {
  this.onchange = callback;
  var obj = {};
  obj["ad"+this.id] = {
    on: true,
    stream: true
  };
  this.Obniz.send(obj);
  return this.value;
};

PeripheralAD.prototype.getWait = function() {
  var self = this;
  return new Promise(function(resolve, reject){
    var obj = {};
    obj["ad"+self.id] = {
      on: true,
      stream: false
    };
    self.Obniz.send(obj);
    self.addObserver(resolve);
  });
};

PeripheralAD.prototype.end = function() {
  this.onchange = null;
  var obj = {};
  obj["ad"+this.id] = null;
  this.Obniz.send(obj);
  return;
};

PeripheralAD.prototype.notified = function(obj) {
  this.value = obj;
  if (this.onchange) {
    this.onchange(obj);
  }
  var callback = this.observers.shift();
  if (callback) {
    callback(obj);
  }
};