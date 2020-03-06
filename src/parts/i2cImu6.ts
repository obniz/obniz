/**
 * @packageDocumentation
 * @module Parts
 */

import i2cParts, { I2cPartsAbstractOptions } from "./i2cParts";

export type accelRange = "2g" | "4g" | "8g" | "16g";
export type gyroRange = "250dps" | "500dps" | "1000dps" | "2000dps";
export type accelUnit = "g" | "mg" | "m_s2";
export type gyroUnit = "dps" | "rps";

export interface Xyz {
  x: number;
  y: number;
  z: number;
}

export interface Inertia6 {
  accelerometer: Xyz;
  gyroscope: Xyz;
  compass?: Xyz;
  temperature?: number | null;
}

export interface I2cImu6AbstractOptions extends I2cPartsAbstractOptions {}

export default abstract class I2cImu6Abstract extends i2cParts {
  // d/so*sf
  protected static scales = {
    accel: {
      so: {
        "2g": 16384, // 1 / 16384 ie. 0.061 mg / digit
        "4g": 8192, //  1 / 8192 ie. 0.122 mg / digit
        "8g": 4096, // 1 / 4096 ie. 0.244 mg / digit
        "16g": 2048, // 1 / 2048 ie. 0.488 mg / digit
      },
      sf: {
        m_s2: 9.80665,
        g: 1,
        mg: 1000,
      },
    },
    gyro: {
      so: {
        "125dps": 262.144, // 32768/125
        "250dps": 131.072, // 32768/250
        "500dps": 65.536,
        "1000dps": 32.768,
        "2000dps": 16.384,
      },
      sf: {
        dps: 1,
        rps: 0.01745329251, // 1 rad/s is 57.295779578552 deg/s
      },
    },
  };

  private static _accelS(value: number, accel_so: accelRange, accel_sf: accelUnit): number {
    return (value / I2cImu6Abstract.scales.accel.so[accel_so]) * I2cImu6Abstract.scales.accel.sf[accel_sf];
  }

  private static _gyroS(value: number, gyro_so: gyroRange, gyro_sf: gyroUnit): number {
    return (value / I2cImu6Abstract.scales.gyro.so[gyro_so]) * I2cImu6Abstract.scales.gyro.sf[gyro_sf];
  }

  protected accel_so: accelRange = "2g";
  protected gyro_so: gyroRange = "250dps";
  protected accel_sf: accelUnit = "g";
  protected gyro_sf: gyroUnit = "dps";

  public abstract async whoamiWait(): Promise<number>;

  public abstract calcTemp(data?: number | null): number | null;

  public abstract async getAccelAdcWait(): Promise<Xyz>;

  public abstract async getGyroAdcWait(): Promise<Xyz>;

  public abstract async getTempAdcWait(): Promise<number>;

  public abstract async getAllAdcWait(): Promise<Inertia6>;

  public async getAccelWait(): Promise<Xyz> {
    const adc = await this.getAccelAdcWait();
    return this.calcAccel(adc);
  }

  public async getGyroWait(): Promise<Xyz> {
    const adc = await this.getGyroAdcWait();
    return this.calcGyro(adc);
  }

  public async getTempWait(): Promise<number | null> {
    const adc = await this.getTempAdcWait();
    return this.calcTemp(adc);
  }

  public async getAllWait(): Promise<Inertia6> {
    const adc = await this.getAllAdcWait();
    const ret: Inertia6 = {
      accelerometer: this.calcAccel(adc.accelerometer),
      gyroscope: this.calcGyro(adc.gyroscope),
      temperature: this.calcTemp(adc.temperature),
    };
    if ("compass" in adc) {
      ret.compass = adc.compass;
    }
    return ret;
  }

  public async getAccelArrayWait(): Promise<number[]> {
    const obj = await this.getAccelWait();
    return [obj.x, obj.y, obj.z];
  }

  public async getGyroArrayWait(): Promise<number[]> {
    const obj = await this.getGyroWait();
    return [obj.x, obj.y, obj.z];
  }

  public async getAllArrayWait(): Promise<any[]> {
    const obj = await this.getAllWait();
    return [
      [obj.accelerometer.x, obj.accelerometer.y, obj.accelerometer.z],
      [obj.gyroscope.x, obj.gyroscope.y, obj.gyroscope.z],
    ];
  }

  public async getAccelAdcArrayWait(): Promise<number[]> {
    const obj = await this.getAccelAdcWait();
    return [obj.x, obj.y, obj.z];
  }

  public async getGyroAdcArrayWait(): Promise<number[]> {
    const obj = await this.getGyroAdcWait();
    return [obj.x, obj.y, obj.z];
  }

  public async getAllAdcArrayWait(): Promise<any[]> {
    const obj = await this.getAllAdcWait();
    return [
      [obj.accelerometer.x, obj.accelerometer.y, obj.accelerometer.z],
      [obj.gyroscope.x, obj.gyroscope.y, obj.gyroscope.z],
    ];
  }

  public abstract setAccelRange(accel_range: accelRange): void;

  public abstract setGyroRange(gyro_range: gyroRange): void;

  public async getAccelerometerWait(): Promise<Xyz> {
    return await this.getAccelWait();
  }

  public async getGyroscopeWait(): Promise<Xyz> {
    return await this.getGyroWait();
  }

  public async getWait(): Promise<Inertia6> {
    return await this.getAllWait();
  }

  public async getAllDataWait(): Promise<Inertia6> {
    return await this.getAllWait();
  }

  public getAccelRange(): accelRange {
    return this.accel_so;
  }

  public getGyroRange(): gyroRange {
    return this.gyro_so;
  }

  public getAccelUnit(): accelUnit {
    return this.accel_sf;
  }

  public getGyroUnit(): gyroUnit {
    return this.gyro_sf;
  }

  public setAccelUnit(accel_unit: accelUnit): void {
    if (accel_unit in I2cImu6Abstract.scales.accel.sf) {
      this.accel_sf = accel_unit;
    } else {
      throw new Error(`Invalid accel unit. Valid values are: ${Object.keys(I2cImu6Abstract.scales.accel.sf).join()}`);
    }
  }

  public setGyroUnit(gyro_unit: gyroUnit): void {
    if (gyro_unit in I2cImu6Abstract.scales.gyro.sf) {
      this.gyro_sf = gyro_unit;
    } else {
      throw new Error(`Invalid gyro unit. Valid values are: ${Object.keys(I2cImu6Abstract.scales.gyro.sf).join()}`);
    }
  }

  private calcAccel(adc: Xyz): Xyz {
    return {
      x: I2cImu6Abstract._accelS(adc.x, this.accel_so, this.accel_sf),
      y: I2cImu6Abstract._accelS(adc.y, this.accel_so, this.accel_sf),
      z: I2cImu6Abstract._accelS(adc.z, this.accel_so, this.accel_sf),
    };
  }

  private calcGyro(adc: Xyz): Xyz {
    return {
      x: I2cImu6Abstract._gyroS(adc.x, this.gyro_so, this.gyro_sf),
      y: I2cImu6Abstract._gyroS(adc.y, this.gyro_so, this.gyro_sf),
      z: I2cImu6Abstract._gyroS(adc.z, this.gyro_so, this.gyro_sf),
    };
  }
}
