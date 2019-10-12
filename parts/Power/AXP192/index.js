class AXP192 {
  constructor() {
    this.requiredKeys = [];
    this.keys = ['sda', 'scl'];
  }

  static info() {
    return {
      name: 'AXP192',
    };
  }

  wired(obniz) {
    this.params.mode = 'master'; //for i2c
    this.params.clock = 400 * 1000; //for i2c
    this.i2c = obniz.getI2CWithConfig(this.params);
  }

  // Module functions
  set(address, data) {
    this.i2c.write(AXP192_ADDRESS, [address, data]);
  }

  async getWait(address) {
    this.i2c.write(AXP192_ADDRESS, [address]);
    return await this.i2c.readWait(AXP192_ADDRESS, 1);
  }

  async setLDO2Voltage(voltage) {
    if (voltage < 1.8) {
      voltage = 1.8;
    }
    if (voltage > 3.3) {
      voltage = 3.3;
    }
    let set = await this.getWait(REG_VOLT_SET_LDO2_3);
    let offset = (voltage - 1.8) * 10;
    if (offset > 15) {
      offset = 15;
    }
    set = (set & 0x0f) | (offset << 4);
    console.log('set voltage to ', set);
    this.set(REG_VOLT_SET_LDO2_3, set);
  }

  async setLDO3Voltage(voltage) {
    if (voltage < 1.8) {
      voltage = 1.8;
    }
    if (voltage > 3.3) {
      voltage = 3.3;
    }
    let set = await this.getWait(REG_VOLT_SET_LDO2_3);
    let offset = (voltage - 1.8) * 10;
    if (offset > 15) {
      offset = 15;
    }
    set = (set & 0xf0) | offset;
    this.set(REG_VOLT_SET_LDO2_3, set);
  }

  set3VLDO2_3() {
    this.set(REG_VOLT_SET_LDO2_3, 0xcc);
  }

  enableLDO2_3() {
    this.set(REG_EN_DC1_LDO2_3, 0x4d);
  }

  async toggleLDO2(val) {
    const bit = val ? 1 : 0;
    let state = await this.getWait(REG_EN_DC1_LDO2_3);
    state = (state & LDO2_EN_MASK) | (bit << 2);
    this.set(REG_EN_DC1_LDO2_3, state);
  }

  async toggleLDO3(val) {
    const bit = val ? 1 : 0;
    let state = await this.getWait(REG_EN_DC1_LDO2_3);
    state = (state & LDO3_EN_MASK) | (bit << 3);
    this.set(REG_EN_DC1_LDO2_3, state);
  }
}

if (typeof module === 'object') {
  module.exports = AXP192;
}

const AXP192_ADDRESS = 0x34;
//const REG_EN_EXT_DC2 = 0x10;
const REG_EN_DC1_LDO2_3 = 0x12;
const REG_VOLT_SET_LDO2_3 = 0x28;
const LDO2_EN_MASK = 0xfb;
const LDO3_EN_MASK = 0xf7;
