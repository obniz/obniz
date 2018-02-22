
var PeripheralSPI = function(Obniz, id) {
  this.Obniz = Obniz;
  this.id = id;
  this.observers = [];
  this.used = false;
};

PeripheralSPI.prototype.addObserver = function(callback) {
  if(callback) {
    this.observers.push(callback);
  }
};

PeripheralSPI.prototype.start = function(params) {
  
  var err = ObnizUtil._requiredKeys(params,["mode", "frequency"]);
  if(err){ throw new Error("spi start param '" + err +"' required, but not found ");return;}
  this.params = ObnizUtil._keyFilter(params,["mode", "clk", "mosi", "miso", "frequency","drive","pull"]);
  var obj = {};
  
  obj["spi" + this.id]  = {
      mode : this.params.mode,
      clock : this.params.frequency   //name different
  };
  if(this.params.clk  !==  undefined){obj["spi" + this.id].clk = this.params.clk;}
  if(this.params.mosi !==  undefined){obj["spi" + this.id].mosi = this.params.mosi;}
  if(this.params.miso !==  undefined){obj["spi" + this.id].miso = this.params.miso;}
  
  if(this.params.drive){
      if(this.params.clk  !==  undefined) this.Obniz.getIO(this.params.clk).drive(this.params.drive);
      if(this.params.mosi !==  undefined) this.Obniz.getIO(this.params.mosi).drive(this.params.drive);
      if(this.params.miso !==  undefined) this.Obniz.getIO(this.params.miso).drive(this.params.drive);
  }else{
      if(this.params.clk  !==  undefined) this.Obniz.getIO(this.params.clk).drive("5v");
      if(this.params.mosi !==  undefined) this.Obniz.getIO(this.params.mosi).drive("5v");
      if(this.params.miso !==  undefined) this.Obniz.getIO(this.params.miso).drive("5v"); 
  }
  
  if(this.params.pull){
      if(this.params.clk  !==  undefined) this.Obniz.getIO(this.params.clk).pull(this.params.pull);
      if(this.params.mosi !==  undefined) this.Obniz.getIO(this.params.mosi).pull(this.params.pull);
      if(this.params.miso !==  undefined) this.Obniz.getIO(this.params.miso).pull(this.params.pull);
  }else{
      if(this.params.clk  !==  undefined) this.Obniz.getIO(this.params.clk).pull(null);
      if(this.params.mosi !==  undefined) this.Obniz.getIO(this.params.mosi).pull(null);
      if(this.params.miso !==  undefined) this.Obniz.getIO(this.params.miso).pull(null);
  }
 
 this.used = true;
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
  return this.used;
};
PeripheralSPI.prototype.end = function(data) {
  var self = this;
  var obj = {};
  obj["spi"+self.id] = null;
  this.params = null;
  self.Obniz.send(obj);
 this.used = false;
};