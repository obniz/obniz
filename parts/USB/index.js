var USB = function() {
    this.keys = ["vcc","gnd"];
    this.requiredKeys = ["vcc","gnd"];
};

USB.prototype.wired = function(obniz) {
  this.obniz = obniz;
  this.io_vdd = obniz.getIO(this.params.vcc);
  this.io_gnd = obniz.getIO(this.params.gnd);
  
  this.io_gnd.output(false);
  
};

USB.prototype.on = function() {
  this.io_vdd.output(true);
};

USB.prototype.off = function() {
  this.io_vdd.output(false);
};

if (PartsRegistrate) {
  PartsRegistrate("USB", USB);
}