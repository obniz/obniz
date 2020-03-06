/**
 * @packageDocumentation
 * @module Parts.KXSC7-2050
 */

import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface KXSC7_2050Options {}

export default class KXSC7_2050 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "KXSC7-2050",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public obniz!: Obniz;
  public params: any;
  public ad_x: any;
  public ad_y: any;
  public ad_z: any;
  public gravity: any;
  public onchangex: any;
  public onchangey: any;
  public onchangez: any;

  constructor() {
    this.keys = ["x", "y", "z", "vcc", "gnd"];
    this.requiredKeys = ["x", "y", "z"];
  }

  public async wired(obniz: any) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, "3v");
    this.ad_x = obniz.getAD(this.params.x);
    this.ad_y = obniz.getAD(this.params.y);
    this.ad_z = obniz.getAD(this.params.z);

    await obniz.wait(500);
    const ad: any = obniz.getAD(this.params.vcc);
    const pwrVoltage: any = await ad.getWait();
    const horizontalZ: any = await this.ad_z.getWait();
    const sensitivity: any = pwrVoltage / 5; // Set sensitivity (unit:V)
    const offsetVoltage: any = horizontalZ - sensitivity; // Set offset voltage (Output voltage at 0g, unit:V)

    const self: any = this;
    this.ad_x.start((value: any) => {
      self.gravity = (value - offsetVoltage) / sensitivity;
      if (self.onchangex) {
        self.onchangex(self.gravity);
      }
    });

    this.ad_y.start((value: any) => {
      self.gravity = (value - offsetVoltage) / sensitivity;
      if (self.onchangey) {
        self.onchangey(self.gravity);
      }
    });

    this.ad_z.start((value: any) => {
      self.gravity = (value - offsetVoltage) / sensitivity;
      if (self.onchangez) {
        self.onchangez(self.gravity);
      }
    });
  }
}
