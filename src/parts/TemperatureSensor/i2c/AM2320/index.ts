/**
 * @packageDocumentation
 * @module Parts.AM2320
 */

/**
 * @packageDocumentation
 * @module Parts
 */

import Obniz from "../../../../obniz";
import PeripheralI2C from "../../../../obniz/libs/io_peripherals/i2c";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
import { I2cPartsAbstractOptions } from "../../../i2cParts";

export interface AM2320Options extends I2cPartsAbstractOptions {}

export default class AM2320 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "AM2320",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;
  public address: any;

  protected obniz!: Obniz;
  protected i2c!: PeripheralI2C;

  constructor() {
    this.keys = ["vcc", "gnd", "sda", "scl", "i2c"];
    this.requiredKeys = [];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.address = 0x5c;
    this.params.pull = "5v";
    this.params.mode = "master";
    this.params.clock = this.params.clock || 100 * 1000;
    this.i2c = obniz.getI2CWithConfig(this.params);
  }

  public async getAllWait(): Promise<{
    temperature: number;
    humidity: number;
  }> {
    const i2cOnerror: any = this.i2c.onerror;
    this.i2c.onerror = () => {};
    this.i2c.write(this.address, [0]); // wake
    this.obniz.wait(2);
    this.i2c.write(this.address, [0x03, 0x00, 0x04]);
    this.obniz.wait(2);
    this.i2c.write(this.address, [0x03, 0x00, 0x04]);
    const ret: any = await this.i2c.readWait(this.address, 6);
    this.i2c.onerror = i2cOnerror;
    if (ret[0] !== 3 || ret[1] !== 4) {
      throw new Error(`Could not receive data correctly`);
    }
    const humidity: any = (ret[2] * 256 + ret[3]) / 10.0;
    const temperature: any = (ret[4] * 256 + ret[5]) / 10.0;
    return { temperature, humidity };
  }

  public async getTempWait(): Promise<number | null> {
    return (await this.getAllWait()).temperature;
  }

  public async getHumdWait(): Promise<number> {
    return await this.getHumidWait();
  }
  public async getHumidWait(): Promise<number> {
    return (await this.getAllWait()).humidity;
  }
}
