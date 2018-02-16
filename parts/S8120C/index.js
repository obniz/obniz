//不調, 正しく測れるときもある...
//原因1:obnizの入力インピーダンスが低すぎる?
//原因2:センサーが発振してる？（データシート通り抵抗を追加したが改善しない）
var S8120C = function() {
  this.keys = ["vcc", "output","gnd"];
  this.requiredKeys = [ "output" ];

};

S8120C.prototype.wired = function(obniz) {
  this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
  this.ad = obniz.getAD(this.params.output);


  var self = this;
  this.ad.start(function(value){
    self.temp = (value - 1.474)/(-0.0082) + 30; //Temp(Celsius) = (([AD Voltage] - [Output Voltage at 30deg])/[V/deg]) + 30
    console.log('value:' + value)
    if (self.onchange) {
      self.onchange(self.temp);
    }
  });

};


if (PartsRegistrate) {
  PartsRegistrate("S8120C", S8120C);
}
