/**
 * @packageDocumentation
 * @module Parts.D6T44L
 */

import Obniz from "../../../../obniz";
import PeripheralI2C from "../../../../obniz/libs/io_peripherals/i2c";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
import { I2cPartsAbstractOptions } from "../../../i2cParts";

export interface D6T44LOptions extends I2cPartsAbstractOptions {}

class D6T44L implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "D6T44L",
    };
  }

  public requiredKeys: string[];
  public keys: string[];
  public params: any;

  public address: any;
  public ioKeys: string[];
  public commands: any;

  protected obniz!: Obniz;
  protected i2c!: PeripheralI2C;

  constructor() {
    this.requiredKeys = [];
    this.keys = ["vcc", "gnd", "sda", "scl", "clock"];
    this.address = 0x0a;

    this.ioKeys = ["vcc", "gnd", "sda", "scl"];
    this.commands = {};
    this.commands.read_data = [0x4c];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    this.params.clock = this.params.clock || 100 * 1000; // for i2c
    this.params.mode = this.params.mode || "master"; // for i2c
    this.params.pull = this.params.pull || null; // for i2c
    this.i2c = obniz.getI2CWithConfig(this.params);
    this.obniz.wait(50);
  }

  public async getOnePixWait(pixcel: number): Promise<number> {
    const data = await this.getAllPixWait();
    return data[pixcel];
  }

  public async getAllPixWait(): Promise<number[]> {
    this.i2c.write(this.address, [0x4c]);
    // await obniz.wait(160);
    const raw = await this.i2c.readWait(this.address, 35);

    const data: number[] = [];

    for (let i = 0; i < 16; i++) {
      data[i] = parseFloat(((raw[i * 2 + 2] + (raw[i * 2 + 3] << 8)) * 0.1).toFixed(1));
    }

    return data;
  }
}

export default D6T44L;
