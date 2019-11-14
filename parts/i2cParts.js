class I2cPartsAbstruct {
  constructor() {
    this.keys = ['gnd', 'sda', 'scl', 'i2c', 'vcc'];
    this.requiredKeys = [];

    this.i2cinfo = this.i2cInfo();
    this.address = this.i2cinfo.address;
  }
  i2cInfo() {
    throw new Error('abstruct class');

    // eslint-disable-next-line no-unreachable
    return {
      address: 0x00,
      clock: 100000,
      voltage: '3v',
    };
  }

  wired(obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(null, this.params.gnd, this.i2cinfo.voltage);
    this.params.clock = this.i2cinfo.clock;
    this.params.pull = this.i2cinfo.voltage;
    this.params.mode = 'master';
    // @ts-ignore
    this.i2c = this.obniz.getI2CWithConfig(this.params);
  }

  char2short(val1, val2) {
    const buffer = new ArrayBuffer(2);
    const dv = new DataView(buffer);
    dv.setUint8(0, val1);
    dv.setUint8(1, val2);
    return dv.getInt16(0, false);
  }

  async readWait(command, length) {
    this.i2c.write(this.address, [command]);
    return await this.i2c.readWait(this.address, length);
  }

  async readUint16Wait(command, length) {
    this.i2c.write(this.address, [command]);
    return await this.i2c.readWait(this.address, length);
  }

  write(command, buf) {
    if (!Array.isArray(buf)) {
      buf = [buf];
    }
    this.i2c.write(this.address, [command, ...buf]);
  }
}
module.exports = I2cPartsAbstruct;
