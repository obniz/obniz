var MCP9701 = function() {

  this.keys = ["vcc", "output", "gnd"];
  this.requiredKeys = [ "output" ];
};

MCP9701.prototype.wired = function(obniz) {
  this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
  this.ad = obniz.getAD(this.params.output);


  var self = this;
  this.ad.start(function(value){
    self.temp = (value-0.4)/0.0195; //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg])/[Temp coefficient]
    if (self.onchange) {
      self.onchange(self.temp);
    }
  });

};


if (PartsRegistrate) {
  PartsRegistrate("MCP9701", MCP9701);
}
