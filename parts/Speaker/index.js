var Speaker = function() {
  
};

Speaker.prototype.wired = function(obniz, io0, io1) {
  this.obniz = obniz;
  this.io0 = obniz.getIO(io0);
  this.pwm = obniz.getpwm();

  this.io0.output(false);
  this.pwm.start(io1);
}

// Module functions

Speaker.prototype.freq = function(freq) {
  this.pwm.freq(freq);
  this.pwm.pulse(1/freq/2*1000);
}

if (PartsRegistrate) {
  PartsRegistrate("Speaker", Speaker);
}