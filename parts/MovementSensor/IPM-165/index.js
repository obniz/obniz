class IPM_165 {
  constructor() {
    this.keys = ['signal', 'vcc', 'gnd'];
    this.requiredKeys = ['signal', 'vcc'];
  }

  static info() {
    return {
      name: 'IPM-165',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
    this.signal = this.obniz.getAD(this.params.signal);
    this.signal.start(value => {
      if (this.onchange) {
        this.onchange(value);
      }
    });
  }

  async getWait() {
    let value = await this.signal.getWait();
    return value;
  }
}

if (typeof module === 'object') {
  module.exports = IPM_165;
}
