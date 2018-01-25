//Todo:抵抗を追加して圧力(kg)を求められるように改造する
var FSR40X = function() {

};

FSR40X.prototype.wired = function(obniz, pin0, pin1) {
  this.obniz = obniz;
  this.io_pwr = obniz.getIO(pin0);
  this.ad = obniz.getAD(pin1);

  this.io_pwr.output(true);

  var self = this;
  this.ad.start(function(value){
    pressure = value * 100;
    if (pressure >= 49){
      pressure = 49;
    }
    self.press = pressure;
    if (self.onchange) {
      self.onchange(self.press);
    }
  });

};

FSR40X.prototype.onChange = function(callback) {
  this.onchange = callback;
};

if (PartsRegistrate) {
  PartsRegistrate("FSR40X", FSR40X);
}
