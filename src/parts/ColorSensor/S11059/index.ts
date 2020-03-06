/**
 * @packageDocumentation
 * @module Parts.S11059
 */

import Obniz from "../../../obniz";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface S11059Options {
  vcc?: number;
  sda?: number;
  scl?: number;
  gnd?: number;
  i2c?: any;
}

export type S11059Gain = 0 | 1;
export type S11059IntergerTime = 0 | 1 | 2 | 3;

export default class S11059 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "S11059",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public address: number;
  public regAdrs: { [key: string]: number };
  public obniz!: Obniz;
  public params: any;
  public i2c!: PeripheralI2C;

  constructor() {
    this.keys = ["vcc", "sda", "scl", "i2c", "gnd"];
    this.requiredKeys = [];

    this.address = 0x2a;
    this.regAdrs = {
      ctrl: 0x00,
      manualTiming: 0x01,
      sensorRed: 0x03,
    };
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, "3v");
    this.obniz.wait(100);

    this.params.clock = 100000;
    this.params.pull = "3v";
    this.params.mode = "master";
    this.i2c = obniz.getI2CWithConfig(this.params);
    this.obniz.wait(100);
  }

  public init(gain: S11059Gain, intergerTime: S11059IntergerTime) {
    this.i2c.write(this.address, [this.regAdrs.ctrl, 0x80]); // Reset
    const val: number = (gain << 3) | intergerTime;
    this.i2c.write(this.address, [this.regAdrs.ctrl, val]); // Set gain,interger time
  }

  public async getVal() {
    this.i2c.write(this.address, [this.regAdrs.sensorRed]);
    const ret = await this.i2c.readWait(this.address, 8);
    const level = [0, 0, 0, 0];
    level[0] = (ret[0] << 8) | ret[1];
    level[1] = (ret[2] << 8) | ret[3];
    level[2] = (ret[4] << 8) | ret[5];
    level[3] = (ret[6] << 8) | ret[7];
    return level;
  }
}
