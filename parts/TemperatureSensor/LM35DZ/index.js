var LM35DZ = function() {
  this.keys = ["vcc","gnd","output"];
  this.requiredKeys = ["output"];
};

LM35DZ.prototype.wired = function(obniz) {
  this.obniz = obniz;
  obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
  this.ad = obniz.getAD(this.params.output);

  var self = this;
  this.ad.start(function(value){
    self.temp = value * 100; //Temp(Celsius) = [AD Voltage] * 100
    if (self.onchange) {
      self.onchange(self.temp);
    }
  });

};

if (PartsRegistrate) {
  PartsRegistrate("LM35DZ", LM35DZ);
}
