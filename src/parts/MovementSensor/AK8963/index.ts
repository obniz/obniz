import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import i2cParts, { I2cInfo, I2cPartsAbstractOptions, Xyz } from "../../i2cParts";

export interface AK8963Options extends I2cPartsAbstractOptions {
  adc_cycle?: number;
}

export default class AK8963 extends i2cParts {

  public static info(): ObnizPartsInfo {
    return {
      name: "AK8963",
    };
  }
  public i2cinfo: I2cInfo;
  constructor() {
    super();
    this.i2cinfo = {
      address: 0x0c,
      clock: 100000,
      voltage: "3v",
      pull: "3v",
    };
  }

  public wired(obniz: Obniz) {
    super.wired(obniz);
    this.setConfig(this.params.adc_cycle || 8);
  }

  public setConfig(ADC_cycle: number) {
    switch (ADC_cycle) {
      case 8:
        this.write(0x0a, [0x12]);
        break;
      case 100:
        this.write(0x0a, [0x16]);
        break;
      default:
        throw new Error("Invalid ADC_cycle value. Valid values are 8,100.");
    }
  }

  public async getWait(): Promise<Xyz> {
    const raw = await this.readWait(0x03, 7);
    return i2cParts.charArrayToXyz(raw, "l", (d) => this.calcMag(d, 16)); // 16bit
  }

  protected calcMag(data: number, bit: number = 16): number {
    switch (bit) {
      case 14:
        return data * 4912 / 8190;
      case 16:
        return data * 4912 / 32760;
      default:
        throw new Error("Invalid bit value.");
    }
  }
}
