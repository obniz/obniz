_24LC256 = function() {

};

_24LC256.prototype.wired = function(obniz, pin0, pin1, pin2, pin3, pin4, pin5, pin6, pin7) {
  this.obniz  = obniz;
  this.io_a0  = obniz.getIO(pin0);
  this.io_a1  = obniz.getIO(pin1);
  this.io_a2  = obniz.getIO(pin2);
  this.io_vss = obniz.getIO(pin3);
  this.io_sda = obniz.getIO(pin4);
  this.io_scl = obniz.getIO(pin5);
  this.io_wp  = obniz.getIO(pin6);
  this.io_vcc = obniz.getIO(pin7);

  this.io_a0.output(false);
  this.io_a1.output(false);
  this.io_a2.output(false);
  this.io_vss.output(false);
  this.io_wp.output(false);
  this.io_vcc.output(true);

  this.i2c = obniz.getFreeI2C();
  this.i2c.start("master", pin4, pin5, 100000, "pullup"); 
}

// Module functions

_24LC256.prototype.set = function(start_address, data) {
  var array = [];
  array.push((start_address >> 8) & 0xFF);
  array.push(start_address & 0xFF);
  array.push.apply(array, data);
  obniz.i2c0.write(0x50, array);
}

_24LC256.prototype.get = async function(address, length) {
  var array = [];
  array.push((start_address >> 8) & 0xFF);
  array.push(start_address & 0xFF);
  obniz.i2c0.write(0x50, array);
  return await obniz.i2c0.readWait(0x50, length);
}

if (PartsRegistrate) {
  PartsRegistrate("24LC256", _24LC256);
}