var ServoMotor = function() {
  this.keys = [ "gnd", "vcc", "signal"];
  this.requiredKeys = ["signal"];
};

ServoMotor.prototype.wired = function(obniz) {
  this.obniz = obniz;
  
  this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    
  this.pwm = obniz.getpwm();
  this.pwm_io_num = this.params.signal;

  this.pwm.start(this.pwm_io_num);
  this.pwm.freq(50);
};

// Module functions

ServoMotor.prototype.angle = function(ratio) {
  var max = 2.4;
  var min = 0.5;
  var val = (max-min) * ratio / 180.0 + min;
  this.pwm.pulse(val);
};

ServoMotor.prototype.on = function() {
  if (this.io_power) {
    this.io_power.output(true);
  }
};

ServoMotor.prototype.off = function() {
  if (this.io_power) {
    this.io_power.output(false);
  }
};

if (PartsRegistrate) {
  PartsRegistrate("ServoMotor", ServoMotor);
}