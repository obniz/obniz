import Obniz from "../../../obniz";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";

import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";
import {I2cPartsAbstractOptions} from "../../i2cParts";
import AK8963 from "../AK8963";
import MPU6050 from "../MPU6050";

export interface MPU9250Options extends I2cPartsAbstractOptions {
}

class MPU9250 implements ObnizPartsInterface {

  public static info(): ObnizPartsInfo {
    return {
      name: "MPU9250",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;
  public _address: any;
  public mpu6050!: MPU6050;
  public ak8963!: AK8963;

  protected obniz!: Obniz;
  protected i2c!: PeripheralI2C;

  constructor() {
    this.keys = ["gnd", "vcc", "sda", "scl", "i2c", "address"];
    this.requiredKeys = [];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this._address = this.params.address || 0x68;
    this.params.clock = 100000;
    this.params.pull = "3v";
    this.params.mode = "master";
    this.i2c = obniz.getI2CWithConfig(this.params);

    this.i2c.write(this._address, [0x6b, 0x00]); // activate MPU9250
    this.i2c.write(this._address, [0x37, 0x02]); // activate AK8963 (bypass)
    this.i2c.write(this._address, [0x1a, 0x06]); // activate LPF (search datasheet_p.13)
    this.i2c.write(this._address, [0x1d, 0x02]); // accel LPF set.

    this.mpu6050 = obniz.wired("MPU6050", {i2c: this.i2c});
    this.ak8963 = obniz.wired("AK8963", {i2c: this.i2c});
  }

  public setConfig(accel_range: any, gyro_range: any, ADC_cycle: any) {
    this.mpu6050.setConfig(accel_range, gyro_range);
    this.ak8963.setConfig(ADC_cycle);
  }

  public async _getAK8963Wait() {
    await this.i2c.write(this._address, [0x02]); // request AK8983 data
    const ST1: any = await this.i2c.readWait(this._address, 1); // confirm magnet value readable
    if (ST1 & 0x01) {
      return await this.ak8963.getWait();
    }
    return {};
  }

  public async getAllWait(): Promise<{
    accelerometer: {
      x: number,
      y: number,
      z: number,
    },
    temp: number,
    gyroscope: {
      x: number,
      y: number,
      z: number,
    },
    compass: {
      x: number,
      y: number,
      z: number,
    },
  }> {
    const data: any = await this.mpu6050.getWait();
    data.compass = await this.ak8963.getWait();
    return data;
  }

  public async getCompassWait(): Promise<{
    x: number,
    y: number,
    z: number,
  }> {
    return await this.ak8963.getWait();
  }

  public async getAccelerometerWait(): Promise<{
    x: number,
    y: number,
    z: number,
  }> {
    return (await this.mpu6050.getWait()).accelerometer;
  }

  public async getGyroscopeWait(): Promise<{
    x: number,
    y: number,
    z: number,
  }> {
    return (await this.mpu6050.getWait()).gyroscope;
  }
}

export default MPU9250;
