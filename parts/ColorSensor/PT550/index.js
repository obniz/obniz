class PT550 {
  constructor() {
    this.keys = ['signal', 'vcc', 'gnd'];
    this.requiredKeys = ['signal'];
  }

  static info() {
    return {
      name: 'PT550',
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
    return await this.signal.getWait();
  }
}

if (typeof module === 'object') {
  module.exports = PT550;
}
