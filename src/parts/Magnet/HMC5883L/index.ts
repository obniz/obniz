/**
 * @packageDocumentation
 * @module Parts.HMC5883L
 */

import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import i2cCompass, { compassUnit, I2cCompassAbstractOptions } from "../../i2cCompass";
import { I2cInfo, Xyz } from "../../i2cParts";

export interface HMC5883LOptions extends I2cCompassAbstractOptions {}

export default class HMC5883L extends i2cCompass {
  public static info(): ObnizPartsInfo {
    return {
      name: "HMC5883L",
    };
  }

  private static commands = {
    config_a: 0x00,
    config_b: 0x01,
    mode: 0x02,
    x_MSB: 0x03,
    status: 0x09,
  };

  private static scales = [1 / 1370, 1 / 1090, 1 / 820, 1 / 660, 1 / 440, 1 / 390, 1 / 330, 1 / 230];
  public i2cinfo: I2cInfo;
  protected so: number;
  protected sf: compassUnit;
  protected range: string;

  protected defaultUnit: compassUnit = "G";

  constructor() {
    super();
    this.i2cinfo = {
      address: 0x1e,
      clock: 100000,
      voltage: "3v",
      pull: "3v",
    };
    this.sf = this.defaultUnit;
    this.so = HMC5883L.scales[1];
    this.range = "8G";
  }

  public wired(obniz: Obniz) {
    super.wired(obniz);
    // this.obniz.wait(500);
    this.init();
  }

  public init() {
    this.reset();
    // this.obniz.wait(500);
  }

  public reset() {
    this.write(HMC5883L.commands.mode, 0x00);
  }

  public async getAdcWait(): Promise<Xyz> {
    const raw = await this.readWait(HMC5883L.commands.x_MSB, 6);
    return HMC5883L.charArrayToXyz(raw, "b");
  }

  public setRange(index: number) {
    this.write(HMC5883L.commands.config_b, index << 5);
    this.so = HMC5883L.scales[index];
  }

  // legacy
  public async get() {
    return await this.getWait();
  }
}
