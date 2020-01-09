class _24LC256 {

  public static info() {
    return {
      name: "24LC256",
    };
  }

  public requiredKeys: any;
  public keys: any;
  public params: any;
  public i2c: any;
  public obniz: any;

  constructor() {
    this.requiredKeys = ["address"];
    this.keys = ["sda", "scl", "clock", "pull", "i2c", "address"];
  }

  public wired(obniz: any) {
    this.params.mode = this.params.mode || "master"; // for i2c
    this.params.clock = this.params.clock || 400 * 1000; // for i2c
    this.i2c = obniz.getI2CWithConfig(this.params);
  }

  // Module functions

  public set(address: any, data: any) {
    const array: any = [];
    array.push((address >> 8) & 0xff);
    array.push(address & 0xff);
    array.push.apply(array, data);
    this.i2c.write(0x50, array);
    this.obniz.wait(4 + 1); // write cycle time = 4ms for 24XX00, 1.5ms for 24C01C, 24C02C
  }

  public async getWait(address: any, length: any) {
    const array: any = [];
    array.push((address >> 8) & 0xff);
    array.push(address & 0xff);
    this.i2c.write(0x50, array);
    return await this.i2c.readWait(0x50, length);
  }
}

if (typeof module === "object") {
  module.exports = _24LC256;
}
