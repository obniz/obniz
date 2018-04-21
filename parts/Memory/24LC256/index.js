class _24LC256 {

  constructor() {
    this.requiredKeys = ["address"];
    this.keys = ["sda","scl","clock","pull","i2c","address"];
  };

  wired(obniz) {
    this.params.mode =  this.params.mode || "master"; //for i2c
    this.params.clock =  this.params.clock || 400 * 1000; //for i2c
    this.i2c = obniz.getI2CWithConfig(this.params);
  };

// Module functions

  set(address, data) {
    var array = [];
    array.push((address >> 8) & 0xFF);
    array.push(address & 0xFF);
    array.push.apply(array, data);
    this.i2c.write(0x50, array);
    this.obniz.wait(4+1); // write cycle time = 4ms for 24XX00, 1.5ms for 24C01C, 24C02C
  };

  async getWait(address, length) {
    var array = [];
    array.push((address >> 8) & 0xFF);
    array.push(address & 0xFF);
    this.i2c.write(0x50, array);
    return await this.i2c.readWait(0x50, length);
  };
}

let Obniz = require("../../../obniz/index.js");
Obniz.PartsRegistrate("24LC256", _24LC256);
