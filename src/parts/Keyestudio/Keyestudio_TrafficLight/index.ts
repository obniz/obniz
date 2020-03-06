/**
 * @packageDocumentation
 * @module Parts.Keyestudio_TrafficLight
 */

import Obniz from "../../../obniz";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import LED from "../../Light/LED";

export type TrafficLightType = "green" | "yellow" | "red";

export interface Keyestudio_TrafficLightOptions {
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

  public green!: LED;
  public yellow!: LED;
  public red!: LED;

  protected obniz!: Obniz;

  private state: TrafficLightType;

  constructor() {
    this.keys = ["gnd", "green", "yellow", "red"];
    this.requiredKeys = ["green", "yellow", "red"];
    this.state = "red";
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

    this.green = obniz.wired("LED", { anode: this.params.green });
    this.yellow = obniz.wired("LED", { anode: this.params.yellow });
    this.red = obniz.wired("LED", { anode: this.params.red });
  }

  public single(led: TrafficLightType) {
    this.green.off();
    this.yellow.off();
    this.red.off();
    this.state = led;
    switch (led) {
      case "green":
        this.green.on();
        break;
      case "yellow":
        this.yellow.on();
        break;
      case "red":
      default:
        this.red.on();
        this.state = "red";
        break;
    }
  }

  public next() {
    switch (this.state) {
      case "green":
        this.single("yellow");
        break;
      case "yellow":
        this.single("red");
        break;
      case "red":
      default:
        this.single("green");
        break;
    }
  }
}
