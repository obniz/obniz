/**
 * @packageDocumentation
 * @module Parts
 */

import Obniz from "../obniz";
import { DriveType, PullType } from "../obniz/libs/io_peripherals/common";
import PeripheralI2C from "../obniz/libs/io_peripherals/i2c";
import ObnizPartsInterface, { ObnizPartsInfo } from "../obniz/ObnizPartsInterface";

export interface Xyz {
  x: number;
  y: number;
  z: number;
}

export interface I2cPartsAbstractOptions {
  vcc?: number;
  gnd?: number;
  sda?: number;
  scl?: number;
  pull?: PullType;
  clock?: number;
  i2c?: PeripheralI2C;
  voltage?: number;
  address?: number;
}

export interface I2cInfo {
  address: number;
  clock: number;
  voltage: DriveType;
  pull: PullType;
}

export default abstract class I2cPartsAbstract implements ObnizPartsInterface {
  public static charArrayToInt16(values: [number, number], endian = "b"): number {
    const buffer = new ArrayBuffer(2);
    const dv = new DataView(buffer);
    dv.setUint8(0, values[0]);
    dv.setUint8(1, values[1]);
    return dv.getInt16(0, endian !== "b");
  }

  public static charArrayToXyz(data: number[], endian = "b", scaleFunc = (d: number): number => d): Xyz {
    return {
      x: scaleFunc(I2cPartsAbstract.charArrayToInt16(data.slice(0, 2) as [number, number], endian)),
      y: scaleFunc(I2cPartsAbstract.charArrayToInt16(data.slice(2, 4) as [number, number], endian)),
      z: scaleFunc(I2cPartsAbstract.charArrayToInt16(data.slice(4, 6) as [number, number], endian)),
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public abstract i2cinfo: I2cInfo;
  public address: any;
  public params: any;

  protected obniz!: Obniz;
  protected i2c!: PeripheralI2C;

  constructor() {
    this.keys = ["gnd", "vcc", "sda", "scl", "i2c", "pull", "clock", "voltage", "address"];
    this.requiredKeys = [];
  }

  // public abstract info(): ObnizPartsInfo;
  public i2cInfo(): I2cInfo {
    return this.i2cinfo;
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    (Object.keys(this.i2cinfo) as Array<keyof I2cInfo>).map((k) => {
      if (typeof this.params[k] === "undefined") {
        this.params[k] = this.i2cinfo[k];
      } else {
        // @ts-ignore
        this.i2cinfo[k] = this.params[k];
      }
    });
    obniz.setVccGnd(this.params.vcc, this.params.gnd, this.params.voltage);
    this.params.mode = "master";
    this.i2c = this.obniz.getI2CWithConfig(this.params);
    this.address = this.i2cinfo.address;
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

  public write(command: any, buf: any) {
    if (!Array.isArray(buf)) {
      buf = [buf];
    }
    this.i2c.write(this.address, [command, ...buf]);
  }

  public async writeFlagWait(address: number, index: number) {
    const tempdata = await this.readWait(address, 1);
    tempdata[0] = tempdata[0] | (0b1 << index);
    this.write(address, tempdata);
  }

  public async clearFlagWait(address: number, index: number) {
    const tempdata = await this.readWait(address, 1);
    tempdata[0] = tempdata[0] & (0xff - (0b1 << index));
    this.write(address, tempdata);
  }

  protected async readInt16Wait(register: number, endian: string = "b"): Promise<number> {
    const data = (await this.readWait(register, 2)) as [number, number];
    return I2cPartsAbstract.charArrayToInt16(data, endian);
  }

  protected async readThreeInt16Wait(register: number, endian: string = "b"): Promise<[number, number, number]> {
    const data: number[] = await this.readWait(register, 6);
    const results: [number, number, number] = [0, 0, 0];
    results[0] = I2cPartsAbstract.charArrayToInt16(data.slice(0, 2) as [number, number], endian);
    results[1] = I2cPartsAbstract.charArrayToInt16(data.slice(2, 4) as [number, number], endian);
    results[2] = I2cPartsAbstract.charArrayToInt16(data.slice(4, 6) as [number, number], endian);
    return results;
  }
}
