/**
 * @packageDocumentation
 * @module Parts.7SegmentLED
 */

import Obniz from "../../../obniz";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface _7SegmentLEDOptions {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
  g: number;
  dp?: number;
  common?: number;
  commonType?: string;
}

class _7SegmentLED implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "7SegmentLED",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public digits: number[];
  public displayIoNames: { [key: string]: string };
  public obniz!: Obniz;
  public ios: PeripheralIO[];
  public params: any;
  public isCathodeCommon: boolean;
  public dp?: PeripheralIO;
  public common?: PeripheralIO;

  constructor() {
    this.keys = ["a", "b", "c", "d", "e", "f", "g", "dp", "common", "commonType"];
    this.requiredKeys = ["a", "b", "c", "d", "e", "f", "g"];

    this.digits = [0x3f, 0x06, 0x5b, 0x4f, 0x66, 0x6d, 0x7d, 0x07, 0x7f, 0x6f, 0x6f];

    this.displayIoNames = {
      a: "a",
      b: "b",
      c: "c",
      d: "d",
      e: "e",
      f: "f",
      g: "g",
      dp: "dp",
      common: "com",
    };
    this.ios = [];
    this.isCathodeCommon = false;
  }

  public wired(obniz: Obniz) {
    function getIO(io: any) {
      if (io && typeof io === "object") {
        if (typeof io.output === "function") {
          return io;
        }
      }
      return obniz.getIO(io);
    }

    function isValidIO(io: any) {
      if (io && typeof io === "object") {
        if (typeof io.output === "function") {
          return true;
        }
      }
      return obniz.isValidIO(io);
    }

    this.obniz = obniz;
    this.ios = [];
    this.ios.push(getIO(this.params.a));
    this.ios.push(getIO(this.params.b));
    this.ios.push(getIO(this.params.c));
    this.ios.push(getIO(this.params.d));
    this.ios.push(getIO(this.params.e));
    this.ios.push(getIO(this.params.f));
    this.ios.push(getIO(this.params.g));

    this.isCathodeCommon = this.params.commonType === "anode" ? false : true;

    for (let i = 0; i < this.ios.length; i++) {
      this.ios[i].output(this.isCathodeCommon ? false : true);
    }

    if (isValidIO(this.params.dp)) {
      const dp = getIO(this.params.dp);
      dp.output(false);
      this.dp = dp;
    }
    if (isValidIO(this.params.common)) {
      this.common = getIO(this.params.common);
      this.on();
    }
  }

  public print(data: number) {
    if (typeof data === "number") {
      data = Math.floor(data);
      data = data % 10;

      for (let i = 0; i < 7; i++) {
        if (this.ios[i]) {
          let val: any = this.digits[data] & (1 << i) ? true : false;
          if (!this.isCathodeCommon) {
            val = !val;
          }
          this.ios[i].output(val);
        }
      }
      this.on();
    }
  }

  public printRaw(data: number) {
    if (typeof data === "number") {
      for (let i = 0; i < 7; i++) {
        if (this.ios[i]) {
          let val: any = data & (1 << i) ? true : false;
          if (!this.isCathodeCommon) {
            val = !val;
          }
          this.ios[i].output(val);
        }
      }
      this.on();
    }
  }

  public dpState(show: boolean) {
    if (this.dp) {
      this.dp.output(this.isCathodeCommon ? show : !show);
    }
  }

  public on() {
    if (this.common) {
      this.common.output(this.isCathodeCommon ? false : true);
    }
  }

  public off() {
    if (this.common) {
      this.common.output(this.isCathodeCommon ? true : false);
    }
  }
}

export default _7SegmentLED;
