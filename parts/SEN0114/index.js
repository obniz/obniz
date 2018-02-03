var SEN0114 = function() {

};

SEN0114.prototype.wired = function(obniz, signal, pwr, gnd) {
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
    self.temp = value; //Temp(Celsius) = [AD Voltage] * 100
    if (self.onchange) {
      self.onchange(self.temp);
    }
  });

};

SEN0114.prototype.onChange = function(callback) {
  this.onchange = callback;
};

SEN0114.prototype.getHumidityWait = async function() {
  return this.ad.value;
};

if (PartsRegistrate) {
  PartsRegistrate("SEN0114", SEN0114);
}
