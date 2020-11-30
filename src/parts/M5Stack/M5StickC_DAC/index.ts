/**
 * @packageDocumentation
 * @module Parts.M5StickC_DAC
 */

import MCP4725, { MCP4725Options } from "../../DAConverter/MCP4725";

import Obniz from "../../../obniz";
import { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface M5StickC_DACOptions extends MCP4725Options {}

export default class M5StickC_DAC extends MCP4725 {
  public static info(): ObnizPartsInfo {
    return {
      name: "M5StickC_DAC",
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
