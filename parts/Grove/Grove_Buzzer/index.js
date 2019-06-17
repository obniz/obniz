class Grove_Buzzer {
  constructor(obniz) {
    this.keys = ['signal', 'gnd', 'vcc'];
    this.requiredKeys = ['gnd', 'vcc'];
  }

  static info() {
    return {
      name: 'Grove_Buzzer',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    this.pwm = obniz.getFreePwm();
    this.pwm.start({ io: this.params.signal });
  }

  play(freq) {
    if (typeof freq !== 'number') {
      throw new Error('freq must be a number');
    }
    freq = parseInt(freq);
    if (freq > 0) {
      this.pwm.freq(freq);
      this.pwm.pulse((1 / freq / 2) * 1000);
    } else {
      this.pwm.pulse(0);
    }
  }

  stop() {
    this.play(0);
  }
}

if (typeof module === 'object') {
  module.exports = Grove_Buzzer;
}
