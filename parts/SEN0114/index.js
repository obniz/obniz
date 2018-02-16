var SEN0114 = function() {
  this.keys = ["vcc", "output","gnd"];
  this.requiredKeys = [ "output" ];

};

SEN0114.prototype.wired = function(obniz) {
  this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
  this.ad = obniz.getAD(this.params.output);

  var self = this;
  this.ad.start(function(value){
    self.temp = value; //Temp(Celsius) = [AD Voltage] * 100
    if (self.onchange) {
      self.onchange(self.temp);
    }
  });

};


SEN0114.prototype.getHumidityWait = async function() {
  return await this.ad.getWait;
};

if (PartsRegistrate) {
  PartsRegistrate("SEN0114", SEN0114);
}
