class Speaker {
  constructor(obniz) {
    this.keys = ['signal', 'gnd'];
    this.requiredKeys = ['gnd'];
  }

  static info() {
    return {
      name: 'Speaker',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(null, this.params.gnd, '5v');
    this.pwm = obniz.getFreePwm();
    this.pwm.start({ io: this.params.signal });
  }

  play(freq) {
    if (freq > 0) {
      this.pwm.freq(freq);
      this.pwm.pulse(1 / freq / 2 * 1000);
    } else {
      this.pwm.pulse(0);
    }
  }

  stop() {
    this.play(0);
  }
}

if (typeof window === 'undefined') {
  module.exports = Speaker;
}
