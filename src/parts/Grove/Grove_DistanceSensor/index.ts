/**
 * @packageDocumentation
 * @module Parts..Grove_DistanceSensor
 */

import Obniz from "../../../obniz";
import PeripheralGrove from "../../../obniz/libs/io_peripherals/grove";
import { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import GP2Y0A21YK0F from "../../../parts/DistanceSensor/GP2Y0A21YK0F";

interface Grove_DistanceSensorOptionsA {
  gnd?: number;
  vcc?: number;
  signal: number;
}

interface Grove_DistanceSensorOptionsB {
  grove: PeripheralGrove;
}

export type Grove_DistanceSensorOptions = Grove_DistanceSensorOptionsA | Grove_DistanceSensorOptionsB;

export default class Grove_DistanceSensor extends GP2Y0A21YK0F {
  public static info(): ObnizPartsInfo {
    return {
      name: "Grove_DistanceSensor",
    };
  }

  constructor() {
    super();
    this.keys = ["gnd", "vcc", "signal", "grove"];
    this.requiredKeys = [];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    if (this.params.grove) {
      const groveAd = this.params.grove.getAnalog("5v", "secondaryOnly");
      this.ad_signal = groveAd.secondary;
    } else {
      this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
      this.ad_signal = obniz.getAD(this.params.signal);
    }
  }
}
