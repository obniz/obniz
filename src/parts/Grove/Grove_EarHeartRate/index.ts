/**
 * @packageDocumentation
 * @module Parts.Grove_EarHeartRate
 */

import Obniz from "../../../obniz";
import PeripheralGrove from "../../../obniz/libs/io_peripherals/grove";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface Grove_EarHeartRateOptionsA {
  signal: number;
  gnd?: number;
  vcc?: number;
}

interface Grove_EarHeartRateOptionsB {
  grove: PeripheralGrove;
}

export type Grove_EarHeartRateOptions = Grove_EarHeartRateOptionsA | Grove_EarHeartRateOptionsB;

export default class Grove_EarHeartRate implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Grove_EarHeartRate",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public displayIoNames = {
    vcc: "vcc",
    gnd: "gnd",
    signal: "signal",
  };
  public params: any;
  public signal: any;

  public interval = 5;
  public duration = 2.5 * 1000;

  protected obniz!: Obniz;

  constructor() {
    this.keys = ["signal", "gnd", "vcc", "grove"];
    this.requiredKeys = [];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    if (this.params.grove) {
      this.signal = this.params.grove.pin1;
      this.params.grove.getDigital("5v");
    } else {
      obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
      this.signal = this.params.signal;
    }
  }

  public start(callback: (rate: number) => void) {
    this.obniz.logicAnalyzer!.start({
      io: this.signal as number,
      interval: this.interval as number,
      duration: this.duration as number,
    });

    this.obniz.logicAnalyzer!.onmeasured = (array: number[]) => {
      const edges: number[] = [];
      for (let i = 0; i < array.length - 1; i++) {
        if (array[i] === 0 && array[i + 1] === 1) {
          edges.push(i);
        }
      }
      if (edges.length >= 2) {
        let between = 0;
        let pulseMin = 0;
        between = ((edges[1] - edges[0]) * this.interval) / 1000.0;
        pulseMin = 60 / between;
        callback(pulseMin);
      }
    };
  }

  public getWait(): Promise<number> {
    return new Promise((resolve) => {
      this.start((rate: number) => {
        resolve(rate);
      });
    });
  }
}
