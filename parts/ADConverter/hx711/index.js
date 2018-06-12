class hx711 {
  constructor() {
    this.keys = ['vcc', 'gnd', 'sck', 'dout'];
    this.requiredKeys = ['sck', 'dout'];
    this.offset = 0;
    this.scale = 1;
  }

  static info() {
    return {
      name: 'hx711',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    this.spi = obniz.getFreeSpi();
    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    let ioKeys = ['clk', 'dout'];
    for (let key of ioKeys) {
      if (this.params[key] && !this.obniz.isValidIO(this.params[key])) {
        throw new Error("spi start param '" + key + "' are to be valid io no");
      }
    }
    this.sck = obniz.getIO(this.params.sck);
    this.dout = obniz.getIO(this.params.dout);

    this.sck.output(true);
  }

  async readWait() {
    this.sck.output(false);

    // while(true) {
    //   let val = await this.dout.inputWait();
    //   if (val == false) break;
    // }
    this.spi.start({
      mode: 'master',
      clk: this.params.sck,
      miso: this.params.dout,
      frequency: 66 * 1000,
    });

    let ret = await this.spi.writeWait([0, 0, 0]);
    this.spi.end(true);
    this.sck.output(false);
    let flag = (ret[0] & 0x80) === 0 ? 1 : -1;
    return flag * (((ret[0] & 0x7f) << 16) + (ret[1] << 8) + (ret[2] << 0));
  }

  async readAverageWait(times) {
    let results = [];
    for (let i = 0; i < times; i++) {
      results.push(await this.readWait());
    }
    return (
      results.reduce((prev, current, i) => {
        return prev + current;
      }, 0) / results.length
    );
  }

  powerDown() {
    this.sck.output(true);
  }

  powerUp() {
    this.sck.output(false);
  }

  async zeroAdjust(times) {
    times = parseInt(times) || 1;
    this.offset = await this.readAverageWait(times);
  }

  async getValueWait(times) {
    times = parseInt(times) || 1;
    let val = await this.readAverageWait(times);
    return (val - this.offset) / this.scale;
  }
}

if (typeof module === 'object') {
  module.exports = hx711;
}
