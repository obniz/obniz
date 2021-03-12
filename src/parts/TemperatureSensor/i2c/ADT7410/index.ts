/**
 * @packageDocumentation
 * @module Parts.ADT7410
 */

import Obniz from "../../../../obniz";
import PeripheralI2C from "../../../../obniz/libs/io_peripherals/i2c";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
import { I2cPartsAbstractOptions } from "../../../i2cParts";

export interface ADT7410Options extends I2cPartsAbstractOptions {
  addressMode: number;
}

export default class ADT7410 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "ADT7410",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;
  public address: any;

  protected obniz!: Obniz;
  protected i2c!: PeripheralI2C;

  constructor() {
    this.keys = ["vcc", "gnd", "sda", "scl", "addressMode"];
    this.requiredKeys = ["addressMode"];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    if (this.params.addressMode === 8) {
      this.address = 0x48;
    } else if (this.params.addressMode === 9) {
      this.address = 0x49;
    } else {
      throw new Error(`please specify address. 8 or 9`);
    }

    this.params.clock = 400000;
    this.params.pull = "5v";
    this.params.mode = "master";

    this.i2c = obniz.getI2CWithConfig(this.params);
  }

  public async getTempWait(): Promise<number> {
    const ret = await this.i2c.readWait(this.address, 2);
    let tempBin: any = ret[0] << 8;
    tempBin |= ret[1];
    tempBin = tempBin >> 3;

    if (tempBin & 0x1000) {
      tempBin = tempBin - 8192;
    }

    return tempBin / 16;
  }
}
