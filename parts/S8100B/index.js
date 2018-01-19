//センサから出力が無い(出力インピーダンス高すぎ？)
S8100B = function() {

};

S8100B.prototype.wired = function(obniz, pwr, signal, gnd) {
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
    self.temp = 30 + ((1.508 - value)/(-0.08)); //Temp(Celsius) =
    if (self.onchange) {
      self.onchange(self.temp);
    }
  });

};

S8100B.prototype.onChange = function(callback) {
  this.onchange = callback;
};

if (PartsRegistrate) {
  PartsRegistrate("S8100B", S8100B);
}
