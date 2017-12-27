PotentionMeter = function() {
  
};

PotentionMeter.prototype.wired = function(obniz, pwr, signal, gnd) {
  this.obniz = obniz;
  this.io_pwr = obniz.getIO(pwr);
  this.ad = obniz.getAD(signal);
  this.io_gnd = obniz.getIO(gnd);

  this.io_pwr.output(true);
  this.io_gnd.output(false);

  var self = this;
  this.ad.start(function(value){
    self.position = value/ 5.0;
    if (self.onchange) {
      self.onchange(self.position);
    }
  });
}

// Module functions

PotentionMeter.prototype.onChange = function(callback) {
  this.onchange = callback;
}

if (PartsRegistrate) {
  PartsRegistrate("PotentionMeter", PotentionMeter);
}