/**
 * @packageDocumentation
 * @module Parts.M5StickC_JoyStick
 */

import Obniz from "../../../obniz";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import { I2cPartsAbstractOptions } from "../../i2cParts";

export type M5StickC_JoyStickOptions = I2cPartsAbstractOptions;

export default class M5StickC_JoyStick implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "M5StickC_JoyStick",
    };
  }

  public requiredKeys: string[];
  public keys: string[];
  public params: any;

  protected obniz!: Obniz;
  protected i2c!: PeripheralI2C;

  constructor() {
    this.keys = ["vcc", "gnd", "sda", "scl", "i2c"];
    this.requiredKeys = [];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    if (!this.obniz.isValidIO(this.params.sda) && !this.obniz.isValidIO(this.params.scl) && !this.params.i2c) {
      if (this.obniz.hasExtraInterface("m5stickc_hat")) {
        const hatI2c = this.obniz.getExtraInterface("m5stickc_hat").i2c;
        this.params.sda = hatI2c.sda;
        this.params.scl = hatI2c.scl;
      } else {
        throw new Error("Cannot find m5stickc hat interface. Please set param 'sda'/'scl' or 'i2c'");
      }
    }

    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.obniz.wait(100); // wait for booting of STM32F030F4
    this.params.mode = "master";
    this.params.clock = 100000;
    this.params.pull = "5v";
    this.i2c = this.obniz.getI2CWithConfig(this.params);
  }

  public async getXWait(): Promise<number> {
    const ret = await this.getXYWait();
    let val = ret[0];
    if (val > 0x7f) {
      val = val - 0x100;
    }
    return val;
  }

  public async getYWait(): Promise<number> {
    const ret = await this.getXYWait();
    let val = ret[1];
    if (val > 0x7f) {
      val = val - 0x100;
    }
    return val;
  }

  public async isPressedWait(): Promise<boolean> {
    this.i2c.write(0x38, [0x02]);
    const ret = await this.i2c.readWait(0x38, 3);
    return !Boolean(ret[2]);
  }

  protected async getXYWait(): Promise<number[]> {
    this.i2c.write(0x38, [0x02]);
    const ret = await this.i2c.readWait(0x38, 3);
    return ret;
  }
}
