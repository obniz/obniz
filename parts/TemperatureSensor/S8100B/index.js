//センサから出力が無い(出力インピーダンス高すぎ？)
var S8100B = function() {
  this.keys = ["vcc", "output","gnd"];
  this.requiredKeys = [ "output" ];

};

S8100B.prototype.wired = function(obniz) {
  this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
  this.ad = obniz.getAD(this.params.output);


  var self = this;
  this.ad.start(function(value){
    self.temp = 30 + ((1.508 - value)/(-0.08)); //Temp(Celsius) =
    if (self.onchange) {
      self.onchange(self.temp);
    }
  });

};


if (PartsRegistrate) {
  PartsRegistrate("S8100B", S8100B);
}
