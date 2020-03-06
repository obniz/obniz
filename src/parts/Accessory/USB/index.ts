/**
 * @packageDocumentation
 * @module Parts.USB
 */
import Obniz from "../../../obniz";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface USBOptions {
  vcc: number;
  gnd: number;
}

export default class USB implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "USB",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public displayIoNames: any;
  public obniz!: Obniz;
  public io_vdd: any;
  public params: any;
  public io_gnd: any;

  constructor() {
    this.keys = ["vcc", "gnd"];
    this.requiredKeys = ["vcc", "gnd"];

    this.displayIoNames = {
      vcc: "vcc",
      gnd: "gnd",
    };
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    this.io_vdd = obniz.getIO(this.params.vcc);
    this.io_gnd = obniz.getIO(this.params.gnd);

    this.io_gnd.output(false);
  }

  public on() {
    this.io_vdd.output(true);
  }

  public off() {
    this.io_vdd.output(false);
  }
}
