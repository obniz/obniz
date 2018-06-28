class S11059 {
  constructor() {
    this.keys = ['vcc', 'sda', 'scl', 'i2c', 'gnd'];
    this.requiredKeys = [];

    this.address = 0x2a;
    this.regAdrs = {};
    this.regAdrs.ctrl = 0x00;
    this.regAdrs.manualTiming = 0x01;
    this.regAdrs.sensorRed = 0x03;
  }

  static info() {
    return {
      name: 'S11059',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, '3v');
    this.obniz.wait(100);

    this.params.clock = 100000;
    this.params.pull = '3v';
    this.params.mode = 'master';
    this.i2c = obniz.getI2CWithConfig(this.params);
    this.obniz.wait(100);
  }

  init(gain, intTime) {
    this.i2c.write(this.address, [this.regAdrs.ctrl, 0x80]); // Reset
    let val = (gain << 3) | intTime;
    this.i2c.write(this.address, [this.regAdrs.ctrl, val]); // Set gain,interger time
  }

  async getVal() {
    this.i2c.write(this.address, [this.regAdrs.sensorRed]);
    let ret = await this.i2c.readWait(this.address, 8);
    let level = [0, 0, 0, 0];
    level[0] = (ret[0] << 8) | ret[1];
    level[1] = (ret[2] << 8) | ret[3];
    level[2] = (ret[4] << 8) | ret[5];
    level[3] = (ret[6] << 8) | ret[7];
    return level;
  }
}

if (typeof module === 'object') {
  module.exports = S11059;
}
