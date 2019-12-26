class HCSR505 {
  constructor() {
    this.keys = ['vcc', 'gnd', 'signal'];
    this.requiredKeys = ['signal'];
  }

  static info() {
    return {
      name: 'HC-SR505',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    this.io_signal = obniz.getIO(this.params.signal);

    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    this.io_signal.input(value => {
      if (this.onchange) {
        this.onchange(value);
      }
    });
  }

  getWait() {
    return this.io_signal.inputWait();
  }
}

if (typeof module === 'object') {
  module.exports = HCSR505;
}
