/**
 * @packageDocumentation
 * @module Parts.24LC256
 */

import Obniz from "../../../obniz";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface _24LC256Options {
  sda?: number;
  scl?: number;
  clock?: number;
  pull?: string;
  i2c?: PeripheralI2C;
  address?: number;
}

export default class _24LC256 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "24LC256",
    };
  }

  public requiredKeys: string[];
  public keys: string[];
  public params: any;

  protected obniz!: Obniz;

  private i2c!: PeripheralI2C;

  constructor() {
    this.requiredKeys = ["address"];
    this.keys = ["sda", "scl", "clock", "pull", "i2c", "address"];
  }

  public wired(obniz: Obniz) {
    this.params.mode = this.params.mode || "master"; // for i2c
    this.params.clock = this.params.clock || 400 * 1000; // for i2c
    this.i2c = obniz.getI2CWithConfig(this.params);
  }

  // Module functions

  public set(address: number, data: number[]) {
    const array = [];
    array.push((address >> 8) & 0xff);
    array.push(address & 0xff);
    array.push.apply(array, data);
    this.i2c.write(0x50, array);
    this.obniz.wait(4 + 1); // write cycle time = 4ms for 24XX00, 1.5ms for 24C01C, 24C02C
  }

  public async getWait(address: number, length: number) {
    const array = [];
    array.push((address >> 8) & 0xff);
    array.push(address & 0xff);
    this.i2c.write(0x50, array);
    return await this.i2c.readWait(0x50, length);
  }
}
