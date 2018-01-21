var MCP9700 = function() {

};

MCP9700.prototype.wired = function(obniz, pwr, signal, gnd) {
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
    self.temp = (value-0.5)/0.01; //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg])/[Temp coefficient]
    if (self.onchange) {
      self.onchange(self.temp);
    }
  });

};

MCP9700.prototype.onChange = function(callback) {
  this.onchange = callback;
};

if (PartsRegistrate) {
  PartsRegistrate("MCP9700", MCP9700);
}
