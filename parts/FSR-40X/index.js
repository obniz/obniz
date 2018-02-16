//Todo:抵抗を追加して圧力(kg)を求められるように改造する
var FSR40X = function() {
  this.keys = ["pin0", "pin1"];
  this.requiredKeys = ["pin0", "pin1"];
};

FSR40X.prototype.wired = function(obniz) {
  this.obniz = obniz;
  
  this.io_pwr = obniz.getIO(this.params.pin0);
  this.ad = obniz.getAD(this.params.pin1);

  this.io_pwr.drive("5v");
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
