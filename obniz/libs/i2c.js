
var PeripheralI2C = function(Obniz, id) {
  this.Obniz = Obniz;
  this.id = id;
  this.observers = [];
  this.state = {};
  this.used = false;
};

PeripheralI2C.prototype.addObserver = function(callback) {
  if(callback) {
    this.observers.push(callback);
  }
};

PeripheralI2C.prototype.start = function(arg) {
  var err = ObnizUtil._requiredKeys(arg,["mode", "sda", "scl", "clock"]);
  if(err){ throw new Error("I2C start param '" + err +"' required, but not found ");return;}
  this.state = ObnizUtil._keyFilter(arg,["mode", "sda", "scl", "clock", "pull", "drive"]);

  if(this.state.drive){
     this.Obniz.getIO(this.state.sda).drive(this.state.drive);
     this.Obniz.getIO(this.state.scl).drive(this.state.drive);
  }else{
      this.Obniz.getIO(this.state.sda).drive("open-drain");
      this.Obniz.getIO(this.state.scl).drive("open-drain");
  }
  
  if(this.state.pull){
     this.Obniz.getIO(this.state.sda).pull(this.state.pull);
     this.Obniz.getIO(this.state.scl).pull(this.state.pull);
  }else{
      this.Obniz.getIO(this.state.sda).pull(null);
      this.Obniz.getIO(this.state.scl).pull(null);
      
  }
  
  var obj = {}; 
  obj["i2c"+this.id] = ObnizUtil._keyFilter(this.state,["mode", "sda", "scl", "clock"]);
  this.used = true;
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
PeripheralI2C.prototype.isUsed = function() {
   return this.used;
};

PeripheralI2C.prototype.end = function() {
  this.state = {};
  var obj = {};
  obj["i2c"+this.id] = null;
  this.Obniz.send(obj);
  this.used = false;
};