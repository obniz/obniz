/**
 * @packageDocumentation
 * @module Parts.SHT31
 */

import Obniz from "../../../../obniz";
import { PullType } from "../../../../obniz/libs/io_peripherals/common";
import PeripheralI2C from "../../../../obniz/libs/io_peripherals/i2c";
import PeripheralIO from "../../../../obniz/libs/io_peripherals/io";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";
import { I2cPartsAbstractOptions } from "../../../i2cParts";

export interface SHT31Options extends I2cPartsAbstractOptions {
  adr: number;
  addressmode: number;
  pull?: PullType;
}

export default class SHT31 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "SHT31",
    };
  }

  public requiredKeys: string[];
  public keys: string[];
  public params: any;

  public ioKeys: string[];
  public commands: any;
  public waitTime: { [key: string]: number };
  public io_adr!: PeripheralIO;
  public address!: number;

  protected obniz!: Obniz;
  protected i2c!: PeripheralI2C;

  constructor() {
    this.requiredKeys = [];
    this.keys = ["vcc", "sda", "scl", "gnd", "adr", "addressmode", "i2c", "pull", "address"];

    this.ioKeys = ["vcc", "sda", "scl", "gnd", "adr"];
    this.commands = {};
    this.commands.softReset = [0x30, 0xa2];
    this.commands.highRepeatStreach = [0x2c, 0x06];
    this.commands.middleRepeatStreach = [0x2c, 0x0d];
    this.commands.lowRepeatStreach = [0x2c, 0x10];
    this.commands.highRepeat = [0x24, 0x00];
    this.commands.mediumRepeat = [0x24, 0x0b];
    this.commands.lowRepeat = [0x24, 0x16];

    this.waitTime = {};
    this.waitTime.wakeup = 1;
    this.waitTime.softReset = 1;
    this.waitTime.lowRepeat = 4;
    this.waitTime.mediumRepeat = 6;
    this.waitTime.highRepeat = 15;

    // not tested
    this.commands.readStatus = [0xf3, 0x2d];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.address = this.params.address || 0x44;

    if (this.params.addressmode) {
      this.io_adr = obniz.getIO(this.params.adr);
      if (this.params.addressmode === 4) {
        this.io_adr.output(false);
        this.address = 0x44;
      } else if (this.params.addressmode === 5) {
        this.io_adr.pull("5v");
        this.address = 0x45;
      }
    }

    this.params.clock = this.params.clock || 100 * 1000; // for i2c
    this.params.mode = this.params.mode || "master"; // for i2c
    this.params.pull = this.params.pull || "5v"; // for i2c
    this.i2c = obniz.getI2CWithConfig(this.params);
    this.i2c.write(this.address, this.commands.softReset);
  }

  public async getData() {
    this.i2c.write(this.address, this.commands.highRepeat);
    await this.obniz.wait(this.waitTime.highRepeat);
    return await this.i2c.readWait(this.address, 6);
  }

  public async getTempWait(): Promise<number> {
    return (await this.getAllWait()).temperature;
  }

  public async getHumdWait(): Promise<number> {
    return await this.getHumidWait();
  }

  public async getHumidWait(): Promise<number> {
    return (await this.getAllWait()).humidity;
  }

  public async getAllWait(): Promise<{
    temperature: number;
    humidity: number;
  }> {
    const ret = await this.getData();

    const tempBin = ret[0] * 256 + ret[1];
    const temperature = -45 + 175 * (tempBin / (65536 - 1));

    const humdBin = ret[3] * 256 + ret[4];
    const humidity = 100 * (humdBin / (65536 - 1));
    return { temperature, humidity };
  }
}
