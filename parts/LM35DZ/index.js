LM35DZ = function() {

};

LM35DZ.prototype.wired = function(obniz, pwr, signal, gnd) {
  this.obniz = obniz;
  this.io_pwr = obniz.getIO(pwr);
  this.io_gnd = obniz.getIO(gnd);
  this.ad = obniz.getAD(signal);

  this.io_pwr.output(true);
  if (gnd) {
    this.io_gnd = obniz.getIO(gnd);
    this.io_gnd.output(false);
  }

  var self = this;
  this.ad.start(function(value){
    self.temp = value * 100; //Temp(Celsius) = [AD Voltage] * 100
    if (self.onchange) {
      self.onchange(self.temp);
    }
  });

};

LM35DZ.prototype.onChange = function(callback) {
  this.onchange = callback;
};

if (PartsRegistrate) {
  PartsRegistrate("LM35DZ", LM35DZ);
}
