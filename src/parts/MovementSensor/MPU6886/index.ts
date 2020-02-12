import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import i2cParts, { I2cPartsAbstractOptions } from "../../i2cParts";

import I2cIMU6, { accelRange, gyroRange, I2cImu6AbstractOptions, Inertia6, Xyz } from "../../i2cImu6";
import { I2cInfo } from "../../i2cParts";

/*
export interface MPU6886Options_beta extends I2cIMU6AbstractOptions {
}
export class MPU6886_beta extends I2cIMU6 {
  private static commands = {
    whoami: 0x75,
    accelIntelCtrl: 0x69,
    smplrtDiv: 0x19,
    intPinCfg: 0x37,
    intEnable: 0x38,
    accelXoutH: 0x3b,
    accelXoutL: 0x3c,
    accelYoutH: 0x3d,
    accelYoutL: 0x3e,
    accelZoutH: 0x3f,
    accelZoutL: 0x40,
    tempOutH: 0x41,
    tempOutL: 0x42,
    gyroXoutH: 0x43,
    gyroXoutL: 0x44,
    gyroYoutH: 0x45,
    gyroYoutL: 0x46,
    gyroZoutH: 0x47,
    gyroZoutL: 0x48,
    userCtrl: 0x6a,
    pwrMgmt1: 0x6b,
    pwrMgmt2: 0x6c,
    config: 0x1a,
    gyroConfig: 0x1b,
    accelConfig: 0x1c,
    accelConfig2: 0x1d,
    fifoEn: 0x23,
  };
  public i2cinfo: I2cInfo;

  constructor() {
    super();
    this.i2cinfo = {
      address: 0x68,
      clock: 100000,
      voltage: "3v",
      pull: "3v",
    };
  }
  public info(): ObnizPartsInfo {
    return {
      name: "MPU6886",
    };
  }
  public whoamiWait(): Promise<number> {
    throw new Error("Method not implemented.");
  } public getAccelWait(): Promise<Xyz> {
    throw new Error("Method not implemented.");
  }
  public getGyroWait(): Promise<Xyz> {
    throw new Error("Method not implemented.");
  }
  public getAllWait(): Promise<Inertia6> {
    throw new Error("Method not implemented.");
  }
  public getTempWait(): Promise<number> {
    throw new Error("Method not implemented.");
  }
  public setAccelRange(accel_range: accelRange): void {
    throw new Error("Method not implemented.");
  }
  public setGyroRange(gyro_range: gyroRange): void {
    throw new Error("Method not implemented.");
  }
}
*/
export interface MPU6886Options extends I2cPartsAbstractOptions {

}

export default class MPU6886 extends i2cParts implements ObnizPartsInterface {

  public static info(): ObnizPartsInfo {
    return {
      name: "MPU6886",
    };
  }
  public i2cinfo: I2cInfo;

  public commands: any;
  public write: any;
  public params: any;
  public char2short: any;

  protected obniz!: Obniz;

  private _accel_range: any;
  private _gyro_range: any;

  constructor() {
    super();
    this.i2cinfo = {
      address: 0x68,
      clock: 100000,
      voltage: "3v",
      pull: "3v",
    };
    this.commands = {};
    this.commands.whoami = 0x75;
    this.commands.accelIntelCtrl = 0x69;
    this.commands.smplrtDiv = 0x19;
    this.commands.intPinCfg = 0x37;
    this.commands.intEnable = 0x38;
    this.commands.accelXoutH = 0x3b;
    this.commands.accelXoutL = 0x3c;
    this.commands.accelYoutH = 0x3d;
    this.commands.accelYoutL = 0x3e;
    this.commands.accelZoutH = 0x3f;
    this.commands.accelZoutL = 0x40;

    this.commands.tempOutH = 0x41;
    this.commands.tempOutL = 0x42;

    this.commands.gyroXoutH = 0x43;
    this.commands.gyroXoutL = 0x44;
    this.commands.gyroYoutH = 0x45;
    this.commands.gyroYoutL = 0x46;
    this.commands.gyroZoutH = 0x47;
    this.commands.gyroZoutL = 0x48;

    this.commands.userCtrl = 0x6a;
    this.commands.pwrMgmt1 = 0x6b;
    this.commands.pwrMgmt2 = 0x6c;
    this.commands.config = 0x1a;
    this.commands.gyroConfig = 0x1b;
    this.commands.accelConfig = 0x1c;
    this.commands.accelConfig2 = 0x1d;
    this.commands.fifoEn = 0x23;
  }

  public wired(obniz: Obniz) {
    super.wired(obniz);

    this.init();
  }

  public async whoamiWait(): Promise<number> {
    const result = await this.readWait(this.commands.whoami, 1);
    return result[0];
  }

  public init() {
    this.write(this.commands.pwrMgmt1, 0x00);
    this.obniz.wait(10);
    this.write(this.commands.pwrMgmt1, 0x01 << 7);
    this.obniz.wait(10);
    this.write(this.commands.pwrMgmt1, 0x01 << 0);
    this.obniz.wait(10);
    this.setConfig(
      this.params.accelerometer_range || 2,
      this.params.gyroscope_range || 250,
    );
    this.obniz.wait(1);
    this.write(this.commands.config, 0x01);
    this.obniz.wait(1);
    this.write(this.commands.smplrtDiv, 0x05);
    this.obniz.wait(1);
    this.write(this.commands.intEnable, 0x00);
    this.obniz.wait(1);
    this.write(this.commands.accelConfig2, 0x00);
    this.obniz.wait(1);
    this.write(this.commands.userCtrl, 0x00);
    this.obniz.wait(1);
    this.write(this.commands.fifoEn, 0x00);
    this.obniz.wait(1);
    this.write(this.commands.intPinCfg, 0x22);
    this.obniz.wait(1);
    this.write(this.commands.intEnable, 0x01);
    this.obniz.wait(1);
  }

  public setConfig(accelerometer_range: number, gyroscope_range: number) {
    // accel range set (0x00:2g, 0x08:4g, 0x10:8g, 0x18:16g)
    switch (accelerometer_range) {
      case 2:
        this.write(this.commands.accelConfig, 0x00);
        break;
      case 4:
        this.write(this.commands.accelConfig, 0x08);
        break;
      case 8:
        this.write(this.commands.accelConfig, 0x10);
        break;
      case 16:
        this.write(this.commands.accelConfig, 0x18);
        break;
      default:
        throw new Error("accel_range variable 2,4,8,16 setting");
    }
    // gyro range & LPF set (0x00:250, 0x08:500, 0x10:1000, 0x18:2000[deg/s])
    switch (gyroscope_range) {
      case 250:
        this.write(this.commands.gyroConfig, 0x00);
        break;
      case 500:
        this.write(this.commands.gyroConfig, 0x08);
        break;
      case 1000:
        this.write(this.commands.gyroConfig, 0x10);
        break;
      case 2000:
        this.write(this.commands.gyroConfig, 0x18);
        break;
      default:
        throw new Error("accel_range variable 250,500,1000,2000 setting");
    }
    this._accel_range = accelerometer_range;
    this._gyro_range = gyroscope_range;
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
    const raw_data = await this.readWait(this.commands.accelXoutH, 14); // request all data
    const ac_scale = this._accel_range / 32768;
    const gy_scale = this._gyro_range / 32768;

    const accelerometer = {
      x: this.char2short(raw_data[0], raw_data[1]) * ac_scale,
      y: this.char2short(raw_data[2], raw_data[3]) * ac_scale,
      z: this.char2short(raw_data[4], raw_data[5]) * ac_scale,
    };
    const temperature =
      this.char2short(raw_data[6], raw_data[7]) / 326.8 + 25.0;
    const gyroscope = {
      x: this.char2short(raw_data[8], raw_data[9]) * gy_scale,
      y: this.char2short(raw_data[10], raw_data[11]) * gy_scale,
      z: this.char2short(raw_data[12], raw_data[13]) * gy_scale,
    };

    return {
      accelerometer,
      temperature,
      gyroscope,
    };
  }

  public async getTempWait(): Promise<number> {
    return (await this.getAllDataWait()).temperature;
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
