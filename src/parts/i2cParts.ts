import Obniz from "../obniz";
import {PullType} from "../obniz/libs/io_peripherals/common";
import PeripheralI2C from "../obniz/libs/io_peripherals/i2c";
import ObnizPartsInterface, {ObnizPartsInfo} from "../obniz/ObnizPartsInterface";

/**
 * @category Parts
 */
export interface  I2cPartsAbstructOptions {
  vcc?: number;
  gnd?: number;
  sda?: number;
  scl?: number;
  pull?: PullType;
  clock: number;
  i2c?: PeripheralI2C;
}

/**
 * @category Parts
 */
export default class I2cPartsAbstruct implements ObnizPartsInterface {
  public keys: string[];
  public requiredKeys: string[];
  public i2cinfo: any;
  public address: any;
  public params: any;

  protected obniz!: Obniz;
  protected i2c!: PeripheralI2C;

  constructor() {
    this.keys = ["gnd", "vcc", "sda", "scl", "i2c", "vcc"];
    this.requiredKeys = [];

    this.i2cinfo = this.i2cInfo();
    this.address = this.i2cinfo.address;
  }

  public i2cInfo() {
    throw new Error("abstruct class");

    // eslint-disable-next-line no-unreachable
    return {
      address: 0x00,
      clock: 100000,
      voltage: "3v",
    };
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, this.i2cinfo.voltage);
    this.params.clock = this.i2cinfo.clock;
    this.params.pull = this.i2cinfo.voltage;
    this.params.mode = "master";
    // @ts-ignore
    this.i2c = this.obniz.getI2CWithConfig(this.params);
  }

  public char2short(val1: number, val2: number) {
    const buffer: any = new ArrayBuffer(2);
    const dv: any = new DataView(buffer);
    dv.setUint8(0, val1);
    dv.setUint8(1, val2);
    return dv.getInt16(0, false);
  }

  public async readWait(command: number, length: number): Promise<number[]> {
    this.i2c.write(this.address, [command]);
    return await this.i2c.readWait(this.address, length);
  }

  // public async readUint16Wait(command: number, length: number): Promise<number[]> {
  //   this.i2c.write(this.address, [command]);
  //   return await this.i2c.readWait(this.address, length);
  // }

  public write(command: any, buf: any) {
    if (!Array.isArray(buf)) {
      buf = [buf];
    }
    this.i2c.write(this.address, [command, ...buf]);
  }
}
