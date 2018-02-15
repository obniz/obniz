
var PeripheralSPI = function(Obniz, id) {
  this.Obniz = Obniz;
  this.id = id;
  this.observers = [];
};

PeripheralSPI.prototype.addObserver = function(callback) {
  if(callback) {
    this.observers.push(callback);
  }
};

PeripheralSPI.prototype.start = function(params) {
  
  var err = ObnizUtil._requiredKeys(params,["mode", "clk", "mosi", "miso", "clock"]);
  if(err){ throw new Error("spi start param '" + err +"' required, but not found ");return;}
  this.params = ObnizUtil._keyFilter(params,["mode", "clk", "mosi", "miso", "clock"]);
  var obj = {};
  obj["spi" + this.id] = this.params;
  
  this.Obniz.send(obj);
};

PeripheralSPI.prototype.writeWait = function(data) {
  var self = this;
  return new Promise(function(resolve, reject){
    var obj = {};
    obj["spi"+self.id] = {
      data: data,
      read: true
    };
    self.Obniz.send(obj);
    self.addObserver(resolve);
  });
};

PeripheralSPI.prototype.write = function(data) {
  var self = this;
  var obj = {};
  obj["spi"+self.id] = {
    data: data
  };
  self.Obniz.send(obj);
};

PeripheralSPI.prototype.notified = function(obj) {
  // TODO: we should compare byte length from sent
  var callback = this.observers.shift();
  if (callback) {
    callback(obj.data);
  }
};

PeripheralSPI.prototype.isUsed = function() {
  return !!this.params;
};
PeripheralSPI.prototype.end = function(data) {
  var self = this;
  var obj = {};
  obj["spi"+self.id] = null;
  this.params = null;
  self.Obniz.send(obj);
};