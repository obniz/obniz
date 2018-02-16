var PotentionMeter = function() {
    this.keys = ["pin0","pin1","pin2"];
    this.reuiredKeys = ["pin0","pin1","pin2"];
};

PotentionMeter.prototype.wired = function(obniz) {
  this.obniz.setVccGnd(this.params.pin0, this.params.pin2, "5v");
  this.ad = obniz.getAD(this.params.pin1);

  var self = this;
  this.ad.start(function(value){
    self.position = value/ 5.0;
    if (self.onchange) {
      self.onchange(self.position);
    }
  });
};


if (PartsRegistrate) {
  PartsRegistrate("PotentionMeter", PotentionMeter);
}