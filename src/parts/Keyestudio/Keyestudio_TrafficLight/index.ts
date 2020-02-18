/**
 * @packageDocumentation
 * @module Parts.Keyestudio_TrafficLight
 */

import Obniz from "../../../obniz";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";
import LED from "../../Light/LED";

export type TrafficLightType = "green" | "yellow" | "red";

export interface  Keyestudio_TrafficLightOptions {
  gnd?: number;
  green: number;
  yellow: number;
  red: number;
}

export default class Keyestudio_TrafficLight implements ObnizPartsInterface {

  public static info(): ObnizPartsInfo {
    return {
      name: "Keyestudio_TrafficLight",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  protected obniz!: Obniz;

  private green_io!: PeripheralIO;
  private yellow_io!: PeripheralIO;
  private red_io!: PeripheralIO;

  constructor() {
    this.keys = ["gnd", "green", "yellow", "red"];
    this.requiredKeys = ["green", "yellow", "red"];
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

    this.obniz = obniz;
    obniz.setVccGnd(null, this.params.gnd, "5v");

    this.green_io = getIO(this.params.green);
    this.yellow_io = getIO(this.params.yellow);
    this.red_io = getIO(this.params.red);
  }

  public on(led: TrafficLightType) {
    if (led === "green") {
      this.green_io.output(true);
    }
    if (led === "yellow") {
      this.yellow_io.output(true);
    }
    if (led === "red") {
      this.red_io.output(true);
    }
  }

  public off(led: TrafficLightType) {
    if (led === "green") {
      this.green_io.output(false);
    }
    if (led === "yellow") {
      this.yellow_io.output(false);
    }
    if (led === "red") {
      this.red_io.output(false);
    }
  }

  public exclusive_on(led: TrafficLightType) {
    this.green_io.output(false);
    this.yellow_io.output(false);
    this.red_io.output(false);
    this.on(led);
  }
}
