import i2cParts, { I2cInfo, I2cPartsAbstractOptions } from "../../i2cParts";

import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface SH200QOptions extends I2cPartsAbstractOptions {
}

export default class SH200Q extends i2cParts implements ObnizPartsInterface {
  public static commands = {
    whoami: 0x30,
    accConfig: 0x0e,
    gyroConfig: 0x0f,
    gyroDlpf: 0x11,
    fifoConfig: 0x12,
    accRange: 0x16,
    gyroRange: 0x2b,
    outputAcc: 0x00,
    outputGyro: 0x06,
    outputTemp: 0x0c,
    regSet1: 0xba,
    regSet2: 0xca,
    adcReset: 0xc2,
    softReset: 0x7f,
    reset: 0x75,
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

  protected obniz!: Obniz;

  private _accel_range: any;
  private _gyro_range: any;

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

    await this.write(0x78, 0x61);
    await this.obniz.wait(1);
    await this.write(0x78, 0x00);

    // set acc odr 256hz
    await this.write(SH200Q.commands.accConfig, 0x91);

    // set gyro odr 500hz
    await this.write(SH200Q.commands.gyroConfig, 0x13);

    // set gyro dlpf 50hz
    await this.write(SH200Q.commands.gyroDlpf, 0x03);

    // set no buffer mode
    await this.write(SH200Q.commands.fifoConfig, 0x00);

    this.setConfig(8, 2000);

    await this.write(SH200Q.commands.regSet1, 0xc0);

    // ADC Reset
    await this.writeFlagWait(SH200Q.commands.regSet2, 4);
    await this.obniz.wait(1);
    await this.clearFlagWait(SH200Q.commands.regSet2, 4);
    await this.obniz.wait(10);
  }

  public setConfig(accelerometer_range: number, gyroscope_range: number) {
    // accel range set (0x00:2g, 0x08:4g, 0x10:8g, 0x18:16g)
    switch (accelerometer_range) {
      case 4:
        this.write(SH200Q.commands.accRange, 0x00);
        break;
      case 8:
        this.write(SH200Q.commands.accRange, 0x01);
        break;
      case 16:
        this.write(SH200Q.commands.accRange, 0x10);
        break;
      default:
        throw new Error("accel_range variable 4,8,16 setting");
    }
    // gyro range & LPF set (0x00:250, 0x08:500, 0x10:1000, 0x18:2000[deg/s])
    switch (gyroscope_range) {
      case 125:
        this.write(SH200Q.commands.gyroRange, 0x04);
        break;
      case 250:
        this.write(SH200Q.commands.gyroRange, 0x03);
        break;
      case 500:
        this.write(SH200Q.commands.gyroRange, 0x02);
        break;
      case 1000:
        this.write(SH200Q.commands.gyroRange, 0x01);
        break;
      case 2000:
        this.write(SH200Q.commands.gyroRange, 0x00);
        break;
      default:
        throw new Error(
          "gyroscope_range variable 125,250,500,1000,2000 setting",
        );
    }
    this._accel_range = accelerometer_range;
    this._gyro_range = gyroscope_range;
  }

  public async resetAdcWait() {
    // set 0xC2 bit2 1-->0
    const tempdata: any = await this.readWait(SH200Q.commands.adcReset, 1);
    tempdata[0] = tempdata[0] | 0x04; // tempdata[0] = 0x0E; //CC
    this.write(SH200Q.commands.adcReset, tempdata);
    await this.obniz.wait(1);
    tempdata[0] = tempdata[0] & 0xfb; // tempdata[0] = 0x0A; //C8
    this.write(SH200Q.commands.adcReset, tempdata);
  }

  public async getAllDataWait(): Promise<{
    accelerometer: {
      x: number,
      y: number,
      z: number,
    },
    temperature: number,
    gyroscope: {
      x: number,
      y: number,
      z: number,
    },
  }> {
    const raw_data: any = await this.readWait(SH200Q.commands.outputAcc, 14); // request all data
    const ac_scale: any = this._accel_range / 32768;
    const gy_scale: any = this._gyro_range / 32768;

    const accelerometer: any = {
      x: this.char2short(raw_data[1], raw_data[0]) * ac_scale,
      y: this.char2short(raw_data[3], raw_data[2]) * ac_scale,
      z: this.char2short(raw_data[5], raw_data[4]) * ac_scale,
    };
    const gyroscope: any = {
      x: this.char2short(raw_data[7], raw_data[6]) * gy_scale,
      y: this.char2short(raw_data[9], raw_data[8]) * gy_scale,
      z: this.char2short(raw_data[11], raw_data[10]) * gy_scale,
    };

    const temperature: any =
      this.char2short(raw_data[13], raw_data[12]) / 333.87 + 21.0;

    return {
      accelerometer,
      temperature,
      gyroscope,
    };
  }

  public async getTempWait(): Promise<number> {
    const raw_data: any = await this.readWait(SH200Q.commands.outputTemp, 2); // request all data
    return this.char2short(raw_data[1], raw_data[0]) / 333.87 + 21.0;
  }

  public async getAccelWait(): Promise<{
    x: number,
    y: number,
    z: number,
  }> {
    return (await this.getAllDataWait()).accelerometer;
  }

  public async getGyroWait(): Promise<{
    x: number,
    y: number,
    z: number,
  }> {
    return (await this.getAllDataWait()).gyroscope;
  }
}
