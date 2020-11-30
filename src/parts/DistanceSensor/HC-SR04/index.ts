/**
 * @packageDocumentation
 * @module Parts.HC-SR04
 */

import Obniz from "../../../obniz";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface HCSR04Options {
  gnd?: number;
  echo: number;
  trigger: number;
  vcc: number;
}

export type HCSR04UnitType = "mm" | "inch";

export default class HCSR04 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "HC-SR04",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public _unit: HCSR04UnitType = "mm";
  public reset_alltime = false;
  public temp = 15;
  public obniz!: Obniz;
  public params: any;
  public vccIO!: PeripheralIO;
  public trigger!: number;
  public echo!: number;

  constructor() {
    this.keys = ["vcc", "trigger", "echo", "gnd"];
    this.requiredKeys = ["vcc", "trigger", "echo"];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(null, this.params.gnd, "5v");

    this.vccIO = obniz.getIO(this.params.vcc);
    if (obniz.isValidIO(this.params.trigger) === false) {
      throw new Error(`trigger ${this.params.trigger} is invalid io`);
    }
    if (obniz.isValidIO(this.params.echo) === false) {
      throw new Error(`echo ${this.params.echo} is invalid io`);
    }
    this.trigger = this.params.trigger;
    this.echo = this.params.echo;

    this.vccIO.drive("5v");
    this.vccIO.output(true);
    this.obniz.wait(100);
  }

  public measure(callback: (distance: number) => void) {
    this.obniz.measure!.echo({
      io_pulse: this.trigger,
      io_echo: this.echo,
      pulse: "positive",
      pulse_width: 0.011,
      measure_edges: 3,
      timeout: (10 / 340) * 1000,
      callback: async (edges: any) => {
        if (this.reset_alltime) {
          this.vccIO.output(false);
          this.obniz.wait(100);
          this.vccIO.output(true);
          this.obniz.wait(100);
        }
        let distance: any;
        for (let i = 0; i < edges.length - 1; i++) {
          // HCSR04's output of io_echo is initially high when trigger is finshed
          if (edges[i].edge === true) {
            const time: any = (edges[i + 1].timing - edges[i].timing) / 1000; // (1/4000 * 8) + is needed??
            distance = (time / 2) * 20.055 * Math.sqrt(this.temp + 273.15) * 1000;
            if (this._unit === "inch") {
              distance = distance * 0.0393701;
            }
          }
        }
        if (typeof callback === "function") {
          callback(distance);
        }
      },
    });
  }

  public async measureWait(): Promise<number> {
    return new Promise((resolve: any) => {
      this.measure((distance: number) => {
        resolve(distance);
      });
    });
  }

  public unit(unit: HCSR04UnitType) {
    if (unit === "mm") {
      this._unit = "mm";
    } else if (unit === "inch") {
      this._unit = "inch";
    } else {
      throw new Error("HCSR04: unknown unit " + unit);
    }
  }
}
