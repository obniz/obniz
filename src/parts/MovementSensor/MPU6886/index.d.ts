import {I2cPartsOptions} from "../../i2cParts";

export interface MPU6886Options  extends  I2cPartsOptions{}


export interface MPU6886 {
  whoamiWait() : Promise<number>;
  setConfig(accel_range: number, gyro_range: number): void;
  getAllDataWait(): Promise<{
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
    }
  }>;
  getTempWait(): Promise<number>;
  getAccelWait(): Promise<{
      x: number,
      y: number,
      z: number,
  }>;
  getGyroWait(): Promise<{
    x: number,
    y: number,
    z: number,
  }>;
}
