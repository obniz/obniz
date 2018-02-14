
var PeripheralI2C = function(Obniz, id) {
  this.Obniz = Obniz;
  this.id = id;
  this.observers = [];
  this.state = {};
};

PeripheralI2C.prototype.addObserver = function(callback) {
  if(callback) {
    this.observers.push(callback);
  }
};

PeripheralI2C.prototype.start = function(mode, sda, scl, clock, pullType) {
  var obj = {};
  this.state = {
    mode,
    sda,
    scl,
    clock
  };
  if (pullType) {
    this.state.pull_type = pullType;
  }
  obj["i2c"+this.id] = this.state;
  this.Obniz.send(obj);
};

PeripheralI2C.prototype.write = function(address, data) {
  var obj = {};
  obj["i2c"+this.id] = {
    address,
    data
  };
  this.Obniz.send(obj);
};

PeripheralI2C.prototype.write10bit = function(address, data) {
  return this.write(address | 0x8000, data);
};

PeripheralI2C.prototype.readWait = function(address, length) {
  var self = this;
  return new Promise(function(resolve, reject){
    var obj = {};
    obj["i2c"+self.id] = {
      address,
      read: length
    };
    self.Obniz.send(obj);
    self.addObserver(resolve);
  });
};

PeripheralI2C.prototype.read10bitWait = function(address, length) {
  return this.readWait(address | 0x8000, length);
};

PeripheralI2C.prototype.notified = function(obj) {
  // TODO: we should compare byte length from sent
  var callback = this.observers.shift();
  if (callback) {
    callback(obj.data);
  }
};

PeripheralI2C.prototype.end = function() {
  this.state = {};
  var obj = {};
  obj["i2c"+this.id] = null;
  this.Obniz.send(obj);
};