/**
 * @packageDocumentation
 * @module Parts.Grove_EarHeartRate
 */

import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface Grove_EarHeartRateOptions {
  gnd: number;
  vcc: number;
  signal?: number;
}

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

  public interval = 5;
  public duration = 2.5 * 1000;

  protected obniz!: Obniz;

  constructor() {
    this.keys = ["vcc", "gnd", "signal"];
    this.requiredKeys = ["vcc", "gnd"];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
  }

  public start(callback: (rate: number) => void) {
    this.obniz.logicAnalyzer!.start({
      io: this.params.signal as number,
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
