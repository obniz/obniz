/**
 * @packageDocumentation
 * @module Parts.ADT7310
 */

import Obniz from "../../../../obniz";
import PeripheralSPI from "../../../../obniz/libs/io_peripherals/spi";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../../obniz/ObnizPartsInterface";

export interface ADT7310Options {
  vcc: number;
  gnd: number;
  din: number;
  dout: number;
  sclk: number;
}

export default class ADT7310 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "ADT7310",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  protected obniz!: Obniz;
  protected spi!: PeripheralSPI;

  constructor() {
    this.keys = ["vcc", "gnd", "frequency", "din", "dout", "clk", "spi"];
    this.requiredKeys = [];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    this.params.mode = this.params.mode || "master";
    this.params.frequency = this.params.frequency || 500000;
    this.params.mosi = this.params.din;
    this.params.miso = this.params.dout;
    this.spi = this.obniz.getSpiWithConfig(this.params);
  }

  public async getTempWait(): Promise<number> {
    await this.spi.writeWait([0x54]); // send before each commands for stable
    await this.obniz.wait(200);
    const ret: any = await this.spi.writeWait([0x00, 0x00]);
    let tempBin: any = ret[0] << 8;
    tempBin |= ret[1];
    tempBin = tempBin >> 3;

    if (tempBin & 0x1000) {
      tempBin = tempBin - 8192;
    }

    return tempBin / 16;
  }
}
