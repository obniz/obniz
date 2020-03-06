/**
 * @packageDocumentation
 * @module Parts.AXP192
 */

import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import { I2cPartsAbstractOptions } from "../../../parts/i2cParts";

export interface AXP192Options extends I2cPartsAbstractOptions {}

export default class AXP192 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "AXP192",
    };
  }

  public requiredKeys: string[];
  public keys: string[];
  public params: any;

  protected i2c: any;

  constructor() {
    this.requiredKeys = [];
    this.keys = ["sda", "scl", "i2c"];
  }

  public wired(obniz: Obniz) {
    this.params.mode = "master"; // for i2c
    this.params.clock = 400 * 1000; // for i2c
    this.i2c = obniz.getI2CWithConfig(this.params);
  }

  // Module functions
  public set(address: number, data: number) {
    this.i2c.write(AXP192_ADDRESS, [address, data]);
  }

  public async getWait(address: number) {
    this.i2c.write(AXP192_ADDRESS, [address]);
    return await this.i2c.readWait(AXP192_ADDRESS, 1);
  }

  public async setLDO2Voltage(voltage: number) {
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
    console.log("set voltage to ", set);
    this.set(REG_VOLT_SET_LDO2_3, set);
  }

  public async setLDO3Voltage(voltage: number) {
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

  public set3VLDO2_3() {
    this.set(REG_VOLT_SET_LDO2_3, 0xcc);
  }

  public enableLDO2_3() {
    this.set(REG_EN_DC1_LDO2_3, 0x4d);
  }

  public async toggleLDO2(val: number) {
    const bit = val ? 1 : 0;
    let state = await this.getWait(REG_EN_DC1_LDO2_3);
    state = (state & LDO2_EN_MASK) | (bit << 2);
    this.set(REG_EN_DC1_LDO2_3, state);
  }

  public async toggleLDO3(val: number) {
    const bit = val ? 1 : 0;
    let state = await this.getWait(REG_EN_DC1_LDO2_3);
    state = (state & LDO3_EN_MASK) | (bit << 3);
    this.set(REG_EN_DC1_LDO2_3, state);
  }

  public initM5StickC() {
    this.i2c.write(AXP192_ADDRESS, [REG_EN_EXT_DC2, 0xff]);
    this.i2c.write(AXP192_ADDRESS, [REG_VOLT_SET_LDO2_3, 0xcc]);
    this.i2c.write(AXP192_ADDRESS, [REG_ADC_EN1, 0xff]);
    this.i2c.write(AXP192_ADDRESS, [REG_CHARGE_CTRL1, 0xc0]);
    this.i2c.write(AXP192_ADDRESS, [REG_CCOUNTER, 0x80]);
    this.i2c.write(AXP192_ADDRESS, [REG_EN_DC1_LDO2_3, 0x4d]);
    this.i2c.write(AXP192_ADDRESS, [REG_PEK, 0x0c]);
    this.i2c.write(AXP192_ADDRESS, [REG_GPIO0, 0x02]);
    this.i2c.write(AXP192_ADDRESS, [REG_VBUS_IPSOUT, 0xe0]);
    this.i2c.write(AXP192_ADDRESS, [REG_CHARGE_OVTEMP, 0xfc]);
    this.i2c.write(AXP192_ADDRESS, [REG_BCKUP_BAT, 0xa2]);
  }

  public async getVbat() {
    this.i2c.write(AXP192_ADDRESS, [REG_VBAT_LSB]);
    const vbat_lsb: any = await this.i2c.readWait(AXP192_ADDRESS, 1);
    this.i2c.write(AXP192_ADDRESS, [REG_VBAT_MSB]);
    const vbat_msb: any = await this.i2c.readWait(AXP192_ADDRESS, 1);
    return (vbat_lsb << 4) + vbat_msb;
  }
}

const AXP192_ADDRESS: any = 0x34;

const REG_EN_EXT_DC2: any = 0x10;
const REG_EN_DC1_LDO2_3: any = 0x12;
const REG_VOLT_SET_LDO2_3: any = 0x28;
const REG_VBUS_IPSOUT: any = 0x30;
const REG_CHARGE_CTRL1: any = 0x33;
const REG_BCKUP_BAT: any = 0x35;
const REG_PEK: any = 0x36;
const REG_CHARGE_OVTEMP: any = 0x39;
const REG_VBAT_LSB: any = 0x78;
const REG_VBAT_MSB: any = 0x79;
const REG_ADC_EN1: any = 0x82;
const REG_GPIO0: any = 0x90;
const REG_CCOUNTER: any = 0xb8;

const LDO2_EN_MASK: any = 0xfb;
const LDO3_EN_MASK: any = 0xf7;
