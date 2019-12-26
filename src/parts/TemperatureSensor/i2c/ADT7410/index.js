class ADT7410 {
  constructor() {
    this.keys = ['vcc', 'gnd', 'sda', 'scl', 'addressMode'];
    this.requiredKeys = ['addressMode'];
  }

  static info() {
    return {
      name: 'ADT7410',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');

    if (this.params.addressMode === 8) {
      this.address = 0x48;
    } else if (this.params.addressMode === 9) {
      this.address = 0x49;
    }

    this.params.clock = 400000;
    this.params.pull = '5v';
    this.params.mode = 'master';

    this.i2c = obniz.getI2CWithConfig(this.params);
  }

  async getTempWait() {
    let ret = await this.i2c.readWait(this.address, 2);
    let tempBin = ret[0] << 8;
    tempBin |= ret[1];
    tempBin = tempBin >> 3;

    if (tempBin & 0x1000) {
      tempBin = tempBin - 8192;
    }

    return tempBin / 16;
  }
}

if (typeof module === 'object') {
  module.exports = ADT7410;
}
