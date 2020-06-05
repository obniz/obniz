/**
 * @packageDocumentation
 * @module Parts.MPU6886
 */

import { I2cInfo, Xyz } from "../../i2cParts";
import MPU6050, { MPU6050Options } from "../MPU6050";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface MPU6886Options extends MPU6050Options {}

export default class MPU6886 extends MPU6050 {
  public static info(): ObnizPartsInfo {
    return {
      name: "MPU6886",
    };
  }
  public i2cinfo: I2cInfo;

  constructor() {
    super();
    this.i2cinfo = {
      address: 0x68,
      clock: 100000,
      voltage: "3v",
      pull: "3v",
    };
    MPU6050.commands.accel_intel_ctrl = 0x69;
    MPU6050.commands.accel_config2 = 0x1d;
    MPU6050.commands.whoami_result = 0x68;
  }

  public init() {
    super.init();
    this.obniz.wait(1);
    this.write(MPU6050.commands.accel_config2, 0x00);
  }
}
