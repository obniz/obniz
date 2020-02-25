/**
 * @packageDocumentation
 * @module Parts.HMC5883L
 */

import Obniz from "../../../obniz";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";

export interface  HMC5883LOptions {
  gnd?: number;
  sda?: number;
  scl?: number;
  i2c?: PeripheralI2C;
}

export default class HMC5883L implements ObnizPartsInterface {

  public static info(): ObnizPartsInfo {
    return {
      name: "HMC5883L",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public address = {
    device: 0x1e,
    reset: [0x02, 0x00], // Continuous Measurment Mode
    xMSB: [0x03],
  };
  public i2c!: PeripheralI2C;

  protected obniz!: Obniz;

  constructor() {
    this.keys = ["gnd", "sda", "scl", "i2c"];
    this.requiredKeys = [];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(null, this.params.gnd, "3v");

    this.params.clock = 100000;
    this.params.pull = "3v";
    this.params.mode = "master";

    this.i2c = obniz.getI2CWithConfig(this.params);

    this.obniz.wait(500);
  }

  public init() {
    this.i2c.write(this.address.device, this.address.reset);
    this.obniz.wait(500);
  }

  public async get() {
    this.i2c.write(this.address.device, this.address.xMSB);
    const readed = await this.i2c.readWait(this.address.device, 2 * 3);

    const obj: any = {};
    const keys = ["x", "y", "z"];
    for (let i = 0; i < 3; i++) {
      let val = (readed[i * 2] << 8) | readed[i * 2 + 1];
      if (val & 0x8000) {
        val = val - 65536;
      }
      obj[keys[i]] = val;
    }

    return obj;
  }
}
