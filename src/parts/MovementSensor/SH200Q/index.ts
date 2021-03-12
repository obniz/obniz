/**
 * @packageDocumentation
 * @module Parts.SH200Q
 */
import i2cParts, { I2cInfo, I2cPartsAbstractOptions } from "../../i2cParts";

import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import I2cImu6, { accelRange, gyroRange, Inertia6, Xyz } from "../../i2cImu6";

export type SH200QAccelRange = "4g" | "8g" | "16g";
export type SH200QGyroRange = "125dps" | "250dps" | "500dps" | "1000dps" | "2000dps";

export interface SH200QOptions extends I2cPartsAbstractOptions {}

export default class SH200Q extends I2cImu6 {
  public static commands = {
    whoami: 0x30,
    whoami_result: 0x18,
    acc_config: 0x0e,
    gyro_config: 0x0f,
    gyro_dlpf: 0x11,
    fifo_config: 0x12,
    acc_range: 0x16,
    gyro_range: 0x2b,
    output_acc: 0x00,
    output_gyro: 0x06,
    output_temp: 0x0c,
    reg_set1: 0xba,
    reg_set2: 0xca,
    adc_reset: 0xc2,
    soft_reset: 0x7f,
    reset: 0x75,
    accel_fs_sel: {
      "4g": 0b00,
      "8g": 0b01,
      "16g": 0b10,
    },
    gyro_fs_sel: {
      "125dps": 0b100,
      "250dps": 0b011,
      "500dps": 0b010,
      "1000dps": 0b001,
      "2000dps": 0b000,
    },
  };

  public static info(): ObnizPartsInfo {
    return {
      name: "SH200Q",
    };
  }

  public i2cinfo: I2cInfo = {
    address: 0x6c,
    clock: 100000,
    voltage: "3v",
    pull: "3v",
  };

  constructor() {
    super();
  }

  public wired(obniz: Obniz) {
    super.wired(obniz);
  }

  public async whoamiWait(): Promise<number> {
    const result = await this.readWait(SH200Q.commands.whoami, 1);
    return result[0];
  }

  public async initWait() {
    await this.resetAdcWait();

    await this.writeFlagWait(0xd8, 7);
    await this.obniz.wait(1);
    await this.clearFlagWait(0xd8, 7);

    this.write(0x78, 0x61);
    await this.obniz.wait(1);
    this.write(0x78, 0x00);

    // set acc odr 256hz
    this.write(SH200Q.commands.acc_config, 0x91);

    // set gyro odr 500hz
    this.write(SH200Q.commands.gyro_config, 0x13);

    // set gyro dlpf 50hz
    this.write(SH200Q.commands.gyro_dlpf, 0x03);

    // set no buffer mode
    this.write(SH200Q.commands.fifo_config, 0x00);

    this.setConfig(8, 2000);

    this.write(SH200Q.commands.reg_set1, 0xc0);

    // ADC Reset
    await this.writeFlagWait(SH200Q.commands.reg_set2, 4);
    await this.obniz.wait(1);
    await this.clearFlagWait(SH200Q.commands.reg_set2, 4);
    await this.obniz.wait(10);
  }

  public setConfig(accelerometer_range: number, gyroscope_range: number) {
    switch (accelerometer_range) {
      case 4:
        this.setAccelRange("4g");
        break;
      case 8:
        this.setAccelRange("8g");
        break;
      case 16:
        this.setAccelRange("16g");
        break;
      default:
        throw new Error("accel_range variable 4,8,16 setting");
    }
    switch (gyroscope_range) {
      case 125:
        this.setGyroRange("125dps");
        break;
      case 250:
        this.setGyroRange("250dps");
        break;
      case 500:
        this.setGyroRange("500dps");
        break;
      case 1000:
        this.setGyroRange("1000dps");
        break;
      case 2000:
        this.setGyroRange("2000dps");
        break;
      default:
        throw new Error("gyroscope_range variable 125,250,500,1000,2000 setting");
    }
  }

  public async resetAdcWait() {
    // set 0xC2 bit2 1-->0
    const tempdata: any = await this.readWait(SH200Q.commands.adc_reset, 1);
    tempdata[0] = tempdata[0] | 0x04; // tempdata[0] = 0x0E; //CC
    this.write(SH200Q.commands.adc_reset, tempdata);
    await this.obniz.wait(1);
    tempdata[0] = tempdata[0] & 0xfb; // tempdata[0] = 0x0A; //C8
    this.write(SH200Q.commands.adc_reset, tempdata);
  }

  public setAccelRange(accel_range: SH200QAccelRange): void {
    if (accel_range in SH200Q.commands.accel_fs_sel) {
      this.write(SH200Q.commands.acc_range, SH200Q.commands.accel_fs_sel[accel_range]);
      this.accel_so = accel_range;
    } else {
      throw new Error(`Invalid accel range. Valid values are: ${Object.keys(SH200Q.commands.accel_fs_sel).join()}`);
    }
  }

  public setGyroRange(gyro_range: SH200QGyroRange): void {
    if (gyro_range in SH200Q.commands.gyro_fs_sel) {
      this.write(SH200Q.commands.gyro_range, SH200Q.commands.gyro_fs_sel[gyro_range]);
      // @ts-ignore
      this.gyro_so = gyro_range;
    } else {
      throw new Error(`Invalid gyro range. Valid values are: ${Object.keys(SH200Q.commands.gyro_fs_sel).join()}`);
    }
  }

  public calcTemp(data?: number | null | undefined): number | null {
    if (typeof data === "undefined" || data === null) {
      return null;
    }
    return data / 333.87 + 21.0;
  }

  public async getAccelAdcWait(): Promise<Xyz> {
    const raw = await this.readWait(SH200Q.commands.output_acc, 6);
    return SH200Q.charArrayToXyz(raw, "l");
  }

  public async getGyroAdcWait(): Promise<Xyz> {
    const raw = await this.readWait(SH200Q.commands.output_gyro, 6);
    return SH200Q.charArrayToXyz(raw, "l");
  }

  public async getTempAdcWait(): Promise<number> {
    const raw = await this.readWait(SH200Q.commands.output_temp, 2);
    return SH200Q.charArrayToInt16(raw as [number, number], "l");
  }

  public async getAllAdcWait(): Promise<Inertia6> {
    const raw = await this.readWait(SH200Q.commands.output_acc, 14); // request all data
    return {
      accelerometer: SH200Q.charArrayToXyz(raw.slice(0, 6), "l"),
      gyroscope: SH200Q.charArrayToXyz(raw.slice(6, 12), "l"),
      temperature: SH200Q.charArrayToInt16(raw.slice(12, 14) as [number, number], "l"),
    };
  }
}
