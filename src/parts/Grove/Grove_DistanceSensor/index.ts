/**
 * @packageDocumentation
 * @module Parts..Grove_DistanceSensor
 */

import Obniz from "../../../obniz";
import PeripheralAD from "../../../obniz/libs/io_peripherals/ad";
import PeripheralGrove from "../../../obniz/libs/io_peripherals/grove";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

interface Grove_DistanceSensorOptionsA {
  gnd?: number;
  vcc?: number;
  signal: number;
}

interface Grove_DistanceSensorOptionsB {
  grove: PeripheralGrove;
}

export type Grove_DistanceSensorOptions = Grove_DistanceSensorOptionsA | Grove_DistanceSensorOptionsB;

export default class GP2Y0A21YK0F implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Grove_distanceSensor",
    };
  }

  public requiredKeys: string[];
  public keys: string[];
  public params: any;

  public ad!: PeripheralAD;
  protected obniz!: Obniz;

  constructor() {
    this.keys = ["vcc", "gnd", "signal", "grove"];
    this.requiredKeys = [];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
  }
}
