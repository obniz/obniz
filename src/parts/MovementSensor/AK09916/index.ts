/**
 * @packageDocumentation
 * @module Parts.AK09916
 */

import i2cParts, { I2cInfo, I2cPartsAbstractOptions } from "../../i2cParts";

import Obniz from "../../../obniz";
import { DriveType, PullType } from "../../../obniz/libs/io_peripherals/common";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface AK09916Options extends I2cPartsAbstractOptions {}

export default class AK09916 extends i2cParts implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "AK09916",
    };
  }

  public i2cinfo: I2cInfo = {
    address: 0x0c,
    clock: 100000,
    voltage: "3v",
    pull: "3v",
  };

  protected obniz!: Obniz;

  private ADDR = 0x0c;

  private _WIA = 0x01;
  private _HXL = 0x11;
  private _HXH = 0x12;
  private _HYL = 0x13;
  private _HYH = 0x14;
  private _HZL = 0x15;
  private _HZH = 0x16;
  private _ST2 = 0x18;
  private _CNTL2 = 0x31;
  private _ASAX = 0x60;
  private _ASAY = 0x61;
  private _ASAZ = 0x62;

  private _MODE_POWER_DOWN = 0b00000000;
  private MODE_SINGLE_MEASURE = 0b00000001;
  private MODE_CONTINOUS_MEASURE_1 = 0b00000010; // 10Hz
  private MODE_CONTINOUS_MEASURE_2 = 0b00001000; // 100Hz
  private MODE_EXTERNAL_TRIGGER_MEASURE = 0b00000100;
  private _MODE_SELF_TEST = 0b00001000;
  private _MODE_FUSE_ROM_ACCESS = 0b00011111;

  private OUTPUT_14_BIT = 0b00000000;
  private OUTPUT_16_BIT = 0b00010000;

  private _SO_14BIT = 0.6; // per digit when 14bit mode
  private _SO_16BIT = 0.15; //  per digit when 16bit mode

  private so: number;

  private offset: [number, number, number];
  private scale: [number, number, number];

  constructor() {
    super();
    this.offset = [0, 0, 0];
    this.scale = [1, 1, 1];
    this.so = this._SO_16BIT;
  }

  public wired(obniz: Obniz): void {
    super.wired(obniz);
    this.write(this._CNTL2, this.MODE_CONTINOUS_MEASURE_1);
  }

  public async magnetic(): Promise<[number, number, number]> {
    // 0111 1111 1111 0000 4912 uT
    // 1111 1111 1111 1111 -1 uT
    // 1000 0000 0001 0000 -4912 uT
    // data[0]下位ビット data[1] 上位ビット

    const raw3: [number, number, number] = await this.readThreeInt16Wait(this._HXL, "l");

    this.readWait(this._ST2, 1);

    const xyz: [number, number, number] = raw3.map((d, i) => {
      return (d * this.so - this.offset[i]) * this.scale[i];
    }) as [number, number, number];
    return xyz;
  }

  public async whoamiWait(): Promise<number> {
    const result = await this.readWait(this._WIA, 1);
    return result[0];
  }

  public async calibrateWait(count: number = 256, delay: number = 200) {
    this.offset = [0, 0, 0];
    this.scale = [1, 1, 1];

    let reading = await this.magnetic();
    let minx = reading[0];
    let maxx = reading[0];
    let miny = reading[1];
    let maxy = reading[1];
    let minz = reading[2];
    let maxz = reading[2];

    while (count > 0) {
      await new Promise((r) => setTimeout(r, delay));

      reading = await this.magnetic();
      minx = Math.min(minx, reading[0]);
      maxx = Math.max(maxx, reading[0]);
      miny = Math.min(miny, reading[1]);
      maxy = Math.max(maxy, reading[1]);
      minz = Math.min(minz, reading[2]);
      maxz = Math.max(maxz, reading[2]);
      count -= 1;
    }

    // Hard iron correction
    const offset_x = (maxx + minx) / 2;
    const offset_y = (maxy + miny) / 2;
    const offset_z = (maxz + minz) / 2;

    this.offset = [offset_x, offset_y, offset_z];

    // Soft iron correction
    const avg_delta_x = (maxx - minx) / 2;
    const avg_delta_y = (maxy - miny) / 2;
    const avg_delta_z = (maxz - minz) / 2;

    const avg_delta = (avg_delta_x + avg_delta_y + avg_delta_z) / 3;

    const scale_x = avg_delta / avg_delta_x;
    const scale_y = avg_delta / avg_delta_y;
    const scale_z = avg_delta / avg_delta_z;

    this.scale = [scale_x, scale_y, scale_z];

    return { offset: this.offset, scale: this.scale };
  }
}
