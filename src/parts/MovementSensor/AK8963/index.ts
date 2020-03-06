/**
 * @packageDocumentation
 * @module Parts.AK8963
 */

import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import i2cCompass, { compassUnit, I2cCompassAbstractOptions } from "../../i2cCompass";
import { I2cInfo, Xyz } from "../../i2cParts";

export interface AK8963Options extends I2cCompassAbstractOptions {
  adc_cycle?: number;
}

export default class AK8963 extends i2cCompass {
  public static info(): ObnizPartsInfo {
    return {
      name: "AK8963",
    };
  }

  private static scales = {
    so_14bit: 4912 / 8190,
    so_16bit: 4912 / 32760,
  };
  public i2cinfo: I2cInfo;
  protected defaultUnit: compassUnit = "uT";
  protected sf: compassUnit;
  protected so: number;
  protected range: string;

  constructor() {
    super();
    this.i2cinfo = {
      address: 0x0c,
      clock: 100000,
      voltage: "3v",
      pull: "3v",
    };
    this.sf = this.defaultUnit;
    this.so = AK8963.scales.so_16bit;
    this.range = "4912uT";
  }

  public wired(obniz: Obniz) {
    super.wired(obniz);
    this.setConfig(this.params.adc_cycle || 8);
  }

  public setConfig(ADC_cycle: number) {
    switch (ADC_cycle) {
      case 8:
        this.write(0x0a, [0x12]); // 16bit
        break;
      case 100:
        this.write(0x0a, [0x16]); // 16bit
        break;
      default:
        throw new Error("Invalid ADC_cycle value. Valid values are 8,100.");
    }
  }

  public async getAdcWait(): Promise<Xyz> {
    const raw = await this.readWait(0x03, 7);
    return AK8963.charArrayToXyz(raw, "l");
  }
}
