/**
 * @packageDocumentation
 * @module Parts.M5StickC_ToF
 */

import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import VL53L0X, { VL53L0XOptions } from "../../DistanceSensor/VL53L0X";

export interface M5StickC_ToFOptions extends VL53L0X {}

export default class M5StickC_ToF extends VL53L0X {
  public static info(): ObnizPartsInfo {
    return {
      name: "M5StickC_ToF",
    };
  }

  public wired(obniz: Obniz) {
    if (!this.obniz.isValidIO(this.params.sda) && !this.obniz.isValidIO(this.params.scl) && !this.params.i2c) {
      if (this.obniz.hasExtraInterface("m5stickc_hat")) {
        const hatI2c = this.obniz.getExtraInterface("m5stickc_hat").i2c;
        this.params.sda = hatI2c.sda;
        this.params.scl = hatI2c.scl;
      } else {
        throw new Error("Cannot find m5stickc hat interface. Please set param 'sda'/'scl' or 'i2c'");
      }
    }
    super.wired(obniz);
  }
}
