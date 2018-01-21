var LM60 = function() {

};

LM60.prototype.wired = function(obniz, pwr, signal, gnd) {
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
    console.log(value)
    self.temp = Math.round(((value-0.424)/0.00625)*10)/10; //Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg(Offset voltage)])/[Temp coefficient]
    if (self.onchange) {
      self.onchange(self.temp);
    }
  });

};

LM60.prototype.onChange = function(callback) {
  this.onchange = callback;
};

if (PartsRegistrate) {
  PartsRegistrate("LM60", LM60);
}
