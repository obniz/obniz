/**
 * @packageDocumentation
 * @module Parts.MPU6500
 */

import { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import MPU6050, { MPU6050Options } from "../MPU6050";

export interface MPU6500Options extends MPU6050Options {}

export default class MPU6500 extends MPU6050 {
  public static info(): ObnizPartsInfo {
    return {
      name: "MPU6500",
    };
  }

  constructor() {
    super();
    MPU6500.commands.whoami_result = 0x70;
    MPU6500.commands.accel_intel_ctrl = 0x69;
    MPU6500.commands.accel_config2 = 0x1d;
  }

  public init() {
    super.init();
    this.obniz.wait(1);
    this.write(MPU6500.commands.accel_config2, 0x00);
  }
}
