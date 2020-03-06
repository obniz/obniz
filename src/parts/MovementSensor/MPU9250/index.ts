/**
 * @packageDocumentation
 * @module Parts.MPU9250
 */

import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import { Inertia6, Xyz } from "../../i2cImu6";
import AK8963, { AK8963Options } from "../AK8963";
import MPU6500, { MPU6500Options } from "../MPU6500";

export interface MPU9250Options extends MPU6500Options {}

export default class MPU9250 extends MPU6500 {
  public static info(): ObnizPartsInfo {
    return {
      name: "MPU9250",
    };
  }

  public ak8963!: AK8963;

  constructor() {
    super();
  }

  public wired(obniz: Obniz) {
    super.wired(obniz);
    this.ak8963 = obniz.wired("AK8963", { i2c: this.i2c });
    this.write(MPU6500.commands.pwr_mgmt_1, [0x00]); // activate MPU9250
    this.write(MPU6500.commands.int_pin_cfg, [0x02]); // activate AK8963 (bypass)
    this.write(MPU6500.commands.config, [0x06]); // activate LPF (search datasheet_p.13)
    this.write(MPU6500.commands.accel_config2, [0x02]); // accel LPF set.
    // this.mpu6050 = obniz.wired("MPU6050", { i2c: this.i2c });
  }

  public init() {
    super.init();
    // this.bypassMagnetometerWait(true);
  }

  public setConfig(accel_range: any, gyro_range: any, ADC_cycle: any) {
    super.setConfig(accel_range, gyro_range);
    if (ADC_cycle) {
      this.ak8963.setConfig(ADC_cycle);
    }
  }

  public async getAllAdcWait(): Promise<Inertia6> {
    const data = await super.getAllAdcWait();
    data.compass = await this.getCompassAdcWait();
    return data;
  }

  public async getAllWait(): Promise<Inertia6> {
    const data = await super.getAllWait();
    data.compass = await this.getCompassWait();
    return data;
  }

  public async getCompassWait(): Promise<Xyz> {
    return await this.ak8963.getWait();
  }

  public async getCompassAdcWait(): Promise<Xyz> {
    return await this.ak8963.getAdcWait();
  }

  public async getCompassArrayWait(): Promise<number[]> {
    return await this.ak8963.getArrayWait();
  }

  public async getCompassAdcArrayWait(): Promise<number[]> {
    return await this.ak8963.getAdcArrayWait();
  }

  public getCompassUnit() {
    return this.ak8963.getUnit();
  }

  public getCompassRange() {
    return this.ak8963.getRange();
  }

  public async getMagneticWait(): Promise<Xyz> {
    return await this.getCompassWait();
  }

  public async getMagneticAdcWait(): Promise<Xyz> {
    return await this.getCompassAdcWait();
  }

  public async getMagneticArrayWait(): Promise<number[]> {
    return await this.getCompassArrayWait();
  }

  public async getMagneticAdcArrayWait(): Promise<number[]> {
    return await this.getCompassAdcArrayWait();
  }

  public getMagneticUnit() {
    return this.getCompassUnit();
  }

  public getMagneticRange() {
    return this.getCompassRange();
  }

  private async _getAK8963Wait() {
    const ST1 = await this.readWait(0x02, 1); // confirm magnet value readable
    if (ST1[0] & 0x01) {
      return await this.ak8963.getWait();
    }
    return {};
  }
}
