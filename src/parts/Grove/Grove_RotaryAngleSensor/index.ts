/**
 * @packageDocumentation
 * @module Parts.Grove_RotaryAngleSensor
 */

import Obniz from "../../../obniz";
import PeripheralAD from "../../../obniz/libs/io_peripherals/ad";
import { DriveType } from "../../../obniz/libs/io_peripherals/common";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface Grove_RotaryAngleSensorOptions {
  signal: number;
  vcc?: number;
  gnd?: number;
}

export default class Grove_RotaryAngleSensor implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Grove_RotaryAngleSensor",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;
  public drive: DriveType;

  // public vcc_voltage = 5.0;
  public position = 0;
  public ad!: PeripheralAD;
  public onchange?: (position: number) => void;

  protected obniz!: Obniz;

  constructor() {
    this.keys = ["signal", "vcc", "gnd"];
    this.requiredKeys = ["signal"];
    this.drive = "5v";
  }

  public wired(obniz: Obniz) {
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, this.drive);
    this.ad = obniz.getAD(this.params.signal);

    this.ad.start((value: number) => {
      this.position = value;
      if (this.onchange) {
        this.onchange(this.position);
      }
    });
  }
}
