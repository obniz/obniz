/**
 * @packageDocumentation
 * @module Parts.7SegmentLEDArray
 */

import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import _7SegmentLED from "../7SegmentLED";

export interface _7SegmentLEDArrayOptions {
  segments: _7SegmentLED[];
}

export default class _7SegmentLEDArray implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "7SegmentLEDArray",
    };
  }

  public identifier: string;
  public keys: string[];
  public requiredKeys: string[];
  public obniz!: Obniz;
  public segments!: _7SegmentLED[];
  public params: any;

  constructor() {
    this.identifier = "" + new Date().getTime();

    this.keys = ["segments"];
    this.requiredKeys = this.keys;
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    this.segments = this.params.segments;
  }

  public print(data: number) {
    if (typeof data === "number") {
      data = Math.floor(data);

      const print: any = (index: number) => {
        let val: any = data;

        for (let i = 0; i < this.segments.length; i++) {
          if (index === i) {
            this.segments[i].print(val % 10);
          } else {
            this.segments[i].off();
          }
          val = val / 10;
        }
      };

      const animations: any = [];
      for (let i = 0; i < this.segments.length; i++) {
        animations.push({
          duration: 3,
          state: print,
        });
      }

      this.obniz.io!.animation(this.identifier, "loop", animations);
    }
  }

  public on() {
    this.obniz.io!.animation(this.identifier, "resume");
  }

  public off() {
    this.obniz.io!.animation(this.identifier, "pause");
    for (let i = 0; i < this.segments.length; i++) {
      this.segments[i].off();
    }
  }
}
