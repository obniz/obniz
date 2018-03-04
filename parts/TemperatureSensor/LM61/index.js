var LM61 = function() {
  this.keys = ["vcc", "output","gnd"];
  this.requiredKeys = [ "output" ];
};

LM61.prototype.wired = function(obniz) {
  
  this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
  this.ad = obniz.getAD(this.params.output);


  var self = this;
  this.ad.start(function(value){
    self.temp = Math.round((value-0.6)/0.01); //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg(Offset voltage)])/[Temp coefficient]
    if (self.onchange) {
      self.onchange(self.temp);
    }
  });

};

if (PartsRegistrate) {
  PartsRegistrate("LM61", LM61);
}
