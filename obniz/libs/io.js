
var PeripheralIO = function(Obniz, id) {
  this.Obniz = Obniz;
  this.id = id;
  this.value = 0;
  this.observers = [];
};

PeripheralIO.prototype.addObserver = function(callback) {
  if(callback) {
    this.observers.push(callback);
  }
};

PeripheralIO.prototype.output = function(value) {
  var obj = {};
  obj["io"+this.id] = value;
  this.value = value;
  this.Obniz.send(obj);
};

PeripheralIO.prototype.outputType = function(type) {
  var obj = {};
  obj["io"+this.id] = {
    output_type: type
  };
  this.Obniz.send(obj);
};

PeripheralIO.prototype.pullType = function(type) {
  var obj = {};
  obj["io"+this.id] = {
    pull_type: type
  };
  this.Obniz.send(obj);
};

PeripheralIO.prototype.pullup5v = function(type) {
  this.pullType("pullup5v");
};

PeripheralIO.prototype.pullup = function(type) {
  this.pullType("pullup");
};

PeripheralIO.prototype.pulldown = function(type) {
  this.pullType("pulldown");
};

PeripheralIO.prototype.float = function(type) {
  this.pullType("float");
};

PeripheralIO.prototype.input = function(callback) {
  this.onchange = callback;
  var obj = {};
  obj["io"+this.id] = {
    direction: "input",
    stream: true
  };
  this.Obniz.send(obj);
  return this.value;
};

PeripheralIO.prototype.inputWait = function() {
  var self = this;
  return new Promise(function(resolve, reject){
    var obj = {};
    obj["io"+self.id] = {
      direction: "input",
      stream: false
    };
    self.Obniz.send(obj);
    self.addObserver(resolve);
  });
};

PeripheralIO.prototype.notified = function(obj) {
  this.value = obj;
  var callback = this.observers.shift();
  if (callback) {
    callback(obj);
  }
  if (typeof(this.onchange) === "function") {
    this.onchange(obj);
  }
};