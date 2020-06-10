/**
 * @packageDocumentation
 * @module Parts.Grove_RotaryAngleSensorOptionsA
 */

import Obniz from "../../../obniz";
import PeripheralAD from "../../../obniz/libs/io_peripherals/ad";
import { DriveType } from "../../../obniz/libs/io_peripherals/common";
import PeripheralGrove from "../../../obniz/libs/io_peripherals/grove";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

interface Grove_RotaryAngleSensorOptionsA {
  signal: number;
  vcc?: number;
  gnd?: number;
}

interface Grove_RotaryAngleSensorOptionsB {
  grove: PeripheralGrove;
}

export type Grove_RotaryAngleSensorOptions = Grove_RotaryAngleSensorOptionsA | Grove_RotaryAngleSensorOptionsB;

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
  public value: any;
  public onchange?: (position: number) => void;

  protected obniz!: Obniz;

  constructor() {
    this.keys = ["vcc", "gnd", "signal", "grove"];
    this.requiredKeys = [];
    this.drive = "5v";
  }

  public wired(obniz: Obniz) {
    if (this.params.grove) {
      const groveAd = this.params.grove.getAnalog();
      this.ad = groveAd.primary;
    } else {
      this.obniz.setVccGnd(this.params.vcc, this.params.gnd, this.drive);
      this.ad = obniz.getAD(this.params.signal);
    }

    this.ad.start((value: number) => {
      this.value = value;
      if (this.onchange) {
        this.onchange(this.value);
      }
    });
  }
}
