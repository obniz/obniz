//不調, 正しく測れるときもある...
//原因1:obnizの入力インピーダンスが低すぎる?
//原因2:センサーが発振してる？（データシート通り抵抗を追加したが改善しない）
var S8120C = function() {

};

S8120C.prototype.wired = function(obniz, pwr, gnd, signal) {
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
    self.temp = (value - 1.474)/(-0.0082) + 30; //Temp(Celsius) = (([AD Voltage] - [Output Voltage at 30deg])/[V/deg]) + 30
    console.log('value:' + value)
    if (self.onchange) {
      self.onchange(self.temp);
    }
  });

};

S8120C.prototype.onChange = function(callback) {
  this.onchange = callback;
};

if (PartsRegistrate) {
  PartsRegistrate("S8120C", S8120C);
}
