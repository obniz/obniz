/**
 * @packageDocumentation
 * @module Parts.IRSensor
 */

import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface IRSensorOptions {
  output: number;
  vcc?: number;
  gnd?: number;
}

export default class IRSensor implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "IRSensor",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public dataSymbolLength = 0.07;
  public duration = 500; // 500msec;
  public dataInverted = true;
  public triggerSampleCount = 16; // If Signal arrives more than this count. then treat as signal
  public cutTail = false;
  public output_pullup = true;
  public ondetect: ((array: number[]) => void) | null = null;

  protected obniz!: Obniz;

  constructor() {
    this.keys = ["output", "vcc", "gnd"];
    this.requiredKeys = ["output"];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    if (!obniz.isValidIO(this.params.output)) {
      throw new Error("output is not valid io");
    }
  }

  public start(callback?: (array: number[]) => void) {
    if (callback) {
      this.ondetect = callback;
    }
    if (this.output_pullup) {
      this.obniz.getIO(this.params.output).pull("5v");
    }

    this.obniz.logicAnalyzer!.start({
      io: this.params.output,
      interval: this.dataSymbolLength,
      duration: this.duration,
      triggerValue: this.dataInverted ? false : true,
      triggerValueSamples: this.triggerSampleCount,
    });
    this.obniz.logicAnalyzer!.onmeasured = (levels: number[]) => {
      if (typeof this.ondetect === "function") {
        if (this.dataInverted) {
          const arr = new Uint8Array(levels);
          for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i] ? 0 : 1;
          }
          levels = Array.from(arr);
        }

        if (this.cutTail) {
          for (let i = levels.length - 1; i > 1; i--) {
            if (levels[i] === 0 && levels[i - 1] === 0) {
              levels.splice(i, 1);
            } else {
              break;
            }
          }
        }

        this.ondetect(levels);
      }
    };
  }
}
