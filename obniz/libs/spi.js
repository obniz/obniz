
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

PeripheralSPI.prototype.start = function(mode, clk, mosi, miso, clock_speed) {
  var obj = {};
  obj["spi"+this.id] = {
    mode: mode,
    clock: clock_speed,
    clk: clk,
    mosi: mosi,
    miso: miso
  };
  this.Obniz.send(obj);
};

PeripheralSPI.prototype.writeWait = function(data) {
  var self = this;
  return new Promise(function(resolve, reject){
    var obj = {};
    obj["spi"+self.id] = {
      writeread: data
    };
    self.Obniz.send(obj);
    self.addObserver(resolve);
  });
};

PeripheralSPI.prototype.notified = function(obj) {
  // TODO: we should compare byte length from sent
  var callback = this.observers.shift();
  if (callback) {
    callback(obj.readed);
  }
};