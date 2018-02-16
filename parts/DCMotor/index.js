var DCMotor = function() {
  this.keys = ["forward", "back"];
  this.requiredKeys = ["forward", "back"];
};

DCMotor.prototype.wired = function(obniz) {
  this.status = {
    direction: null,
    power: null
  };

  this.pwm1_io_num = this.params.forward;
  this.pwm2_io_num = this.params.back;

  this.pwm1 = obniz.getpwm();
  this.pwm1.start(this.pwm1_io_num);
  this.pwm1.freq(100000);
  this.pwm2 = obniz.getpwm();
  this.pwm2.start(this.pwm2_io_num);
  this.pwm2.freq(100000);
  this.power(30);
  this.pwm1.forceWorking(true);
  this.pwm2.forceWorking(true);
};

// Module functions

DCMotor.prototype.forward = function() {
  this.move(true);
};

DCMotor.prototype.reverse = function() {
  this.move(false);
};

DCMotor.prototype.stop = function() {
  if (this.status.direction === null) {
    return;
  }
  this.status.direction = null;
  this.pwm1.duty(0);
  this.pwm2.duty(0);
};

DCMotor.prototype.move = function(forward) {
  if (forward) {
    if (this.status.direction === true) {
      return;
    }
    this.status.direction = true;
  } else {
    if (this.status.direction === false) {
      return;
    }
    this.status.direction = false;
  }
  var power = this.power();
  this.power(0);
  this.power(power);
};

DCMotor.prototype.power = function(power) {
  if (power === undefined) {
    return this.status.power;
  }
  this.status.power = power;
  if (this.status.direction === null) {
    this.pwm1.duty(0);
    this.pwm2.duty(0);
    return;
  }
  if (this.status.direction) {
    this.pwm1.duty(power);
    this.pwm2.duty(0);
  } else {
    this.pwm1.duty(0);
    this.pwm2.duty(power);
  }
};

if (PartsRegistrate) {
  PartsRegistrate("DCMotor", DCMotor);
}