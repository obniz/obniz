class HMC5883L {
  constructor() {
    this.keys = ['vcc', 'gnd', 'sda', 'scl'];

    this.address = {};
    this.address.device = 0x1e;
    this.address.reset = [0x02, 0x00];
    this.address.xMSB = [0x03];
    this.address.xLSB = [0x04];
    this.address.yMSB = [0x05];
    this.address.yLSB = [0x06];
    this.address.zMSB = [0x07];
    this.address.zLSB = [0x08];
  }

  static info() {
    return {
      name: 'HMC5883L',
    };
  }

  wired(obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, '3v');

    this.params.clock = 100000;
    this.params.pull = '3v';
    this.params.mode = 'master';

    this.i2c = obniz.getI2CWithConfig(this.params);
  }

  init() {
    this.i2c.write(this.address.device, this.address.reset);
    this.obniz.wait(500);
  }

  async get(axis) {
    let axisAddrMSB;
    let axisAddrLSB;
    if (axis == 'x') {
      axisAddrMSB = this.address.xMSB;
      axisAddrLSB = this.address.xLSB;
    } else if (axis == 'y') {
      axisAddrMSB = this.address.yMSB;
      axisAddrLSB = this.address.yLSB;
    } else if (axis == 'z') {
      axisAddrMSB = this.address.zMSB;
      axisAddrLSB = this.address.zLSB;
    }
    this.i2c.write(this.address.device, axisAddrMSB);
    let msb = await this.i2c.readWait(this.address.device, 1);
    this.i2c.write(this.address.device, axisAddrLSB);
    let lsb = await this.i2c.readWait(this.address.device, 1);

    let val = (msb << 8) | lsb;

    if (val & 0x8000) {
      val = val - 65536;
    }
    return val;
  }
}

if (typeof module === 'object') {
  module.exports = HMC5883L;
}
