var ServoMotor = function() {

};

ServoMotor.prototype.wired = function(obniz, gnd, power, signal) {
  this.obniz = obniz;
  if (power == null || signal == null) {
    this.pwm_io_num = gnd;
    this.pwm = obniz.getpwm();
  } else {
    this.io_gnd = obniz.getIO(gnd);
    this.io_power = obniz.getIO(power);
  
    this.io_gnd.output(false);
    this.io_power.output(true);
    
    this.pwm = obniz.getpwm();
    this.pwm_io_num = signal;
  }
  this.pwm.start(this.pwm_io_num);
  this.pwm.freq(50);
}

// Module functions

ServoMotor.prototype.angle = function(ratio) {
  var max = 2.4
  var min = 0.5;
  var val = (max-min) * ratio / 180.0 + min;
  this.pwm.pulse(val);
}

ServoMotor.prototype.on = function() {
  if (this.io_power) {
    this.io_power.output(true);
  }
}

ServoMotor.prototype.off = function() {
  if (this.io_power) {
    this.io_power.output(false);
  }
}

if (PartsRegistrate) {
  PartsRegistrate("ServoMotor", ServoMotor);
}