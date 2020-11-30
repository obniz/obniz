/**
 * @packageDocumentation
 * @module Parts.Grove_JoyStick
 */

import Obniz from "../../../obniz";
import PeripheralGrove from "../../../obniz/libs/io_peripherals/grove";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import { I2cPartsAbstractOptions } from "../../i2cParts";

interface GroveInterface {
  grove: PeripheralGrove;
}

export type Grove_JoyStickOptions = I2cPartsAbstractOptions | GroveInterface;

export default class Grove_JoyStick implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Grove_JoyStick",
    };
  }

  public requiredKeys: string[];
  public keys: string[];
  public params: any;

  protected obniz!: Obniz;
  protected i2c!: PeripheralI2C;

  constructor() {
    this.keys = ["vcc", "gnd", "sda", "scl", "i2c", "grove"];
    this.requiredKeys = [];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    const speed = 400000;
    if (this.params.grove) {
      this.i2c = this.params.grove.getI2c(speed, "5v");
    } else {
      this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
      this.obniz.wait(100); // wait for booting of MEGA328
      this.params.mode = "master";
      this.params.clock = speed;
      this.params.pull = "5v";
      this.i2c = this.obniz.getI2CWithConfig(this.params);
    }
  }

  public async getXWait(): Promise<number> {
    const ret = await this.i2c.readWait(0x52, 3);
    return ret[0];
  }

  public async getYWait(): Promise<number> {
    const ret = await this.i2c.readWait(0x52, 3);
    return ret[1];
  }

  public async isPressedWait(): Promise<boolean> {
    const ret = await this.i2c.readWait(0x52, 3);
    return Boolean(ret[2]);
  }
}
