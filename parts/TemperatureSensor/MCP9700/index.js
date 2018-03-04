var MCP9700 = function() {

  this.keys = ["vcc", "output", "gnd"];
  this.requiredKeys = [ "output" ];
};

MCP9700.prototype.wired = function(obniz) {
  this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
  this.ad = obniz.getAD(this.params.output);

  var self = this;
  this.ad.start(function(value){
    self.temp = (value-0.5)/0.01; //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg])/[Temp coefficient]
    if (self.onchange) {
      self.onchange(self.temp);
    }
  });

};

if (PartsRegistrate) {
  PartsRegistrate("MCP9700", MCP9700);
}
