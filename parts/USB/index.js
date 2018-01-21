var USB = function() {
  
};

USB.prototype.wired = function(obniz, vdd, gnd) {
  this.obniz = obniz;
  this.io_vdd = obniz.getIO(vdd);
  this.io_gnd = obniz.getIO(gnd);
  
  this.io_gnd.output(false);
  
}

USB.prototype.on = function() {
  this.io_vdd.output(true);
}

USB.prototype.off = function() {
  this.io_vdd.output(false);
}

if (PartsRegistrate) {
  PartsRegistrate("USB", USB);
}