/**
 * @packageDocumentation
 * @module Parts.Grove_Relay
 */

import Obniz from "../../../obniz";
import PeripheralGrove from "../../../obniz/libs/io_peripherals/grove";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface Grove_RelayOptionsA {
  signal: number;
  gnd?: number;
  vcc?: number;
}

interface Grove_RelayOptionsB {
  grove: PeripheralGrove;
}

export type Grove_RelayOptions = Grove_RelayOptionsA | Grove_RelayOptionsB;

export default class Grove_Relay implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Grove_Relay",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public io_signal: any;

  protected obniz!: Obniz;

  constructor() {
    this.keys = ["signal", "gnd", "vcc", "grove"];
    this.requiredKeys = [];
  }

  public wired(obniz: Obniz) {
    if (this.params.grove) {
      this.io_signal = this.params.grove.getDigital();
    } else {
      this.obniz = obniz;
      obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
      this.io_signal = obniz.getIO(this.params.signal);
    }

    this.off();
  }

  public on() {
    this.io_signal.output(true);
  }

  public off() {
    this.io_signal.output(false);
  }
}
