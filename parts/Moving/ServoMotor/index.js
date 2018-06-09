class ServoMotor {
  constructor() {
    this.keys = ['gnd', 'vcc', 'signal'];
    this.requiredKeys = ['signal'];
  }

  static info() {
    return {
      name: 'ServoMotor',
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    if (obniz.isValidIO(this.params.vcc)) {
      this.io_vcc = obniz.getIO(this.params.vcc);
    }

    this.pwm = obniz.getFreePwm();
    this.pwm_io_num = this.params.signal;

    this.pwm.start({ io: this.pwm_io_num });
    this.pwm.freq(50);
  }

  // Module functions

  angle(ratio) {
    let max = 2.4;
    let min = 0.5;
    let val = (max - min) * ratio / 180.0 + min;
    this.pwm.pulse(val);
  }

  on() {
    if (this.io_vcc) {
      this.io_vcc.output(true);
    }
  }

  off() {
    if (this.io_vcc) {
      this.io_vcc.output(false);
    }
  }
}

if (typeof window === 'undefined') {
  module.exports = ServoMotor;
}
