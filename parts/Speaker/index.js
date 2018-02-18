var Speaker = function() {
  this.keys = ["signal","gnd"];
  this.requiredKeys = ["gnd"];
};

Speaker.prototype.wired = function(obniz) {
  this.obniz.setVccGnd(null, this.params.gnd, "5v");
  this.pwm = obniz.getpwm();
  this.pwm.start(this.params.signal);
};

// Module functions

Speaker.prototype.freq = function(freq) {
  this.pwm.freq(freq);
  this.pwm.pulse(1/freq/2*1000);
};

if (PartsRegistrate) {
  PartsRegistrate("Speaker", Speaker);
}