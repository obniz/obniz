/**
 * @packageDocumentation
 * @module Parts.MQGas
 */

import Obniz from "../../../obniz";
import PeripheralAD from "../../../obniz/libs/io_peripherals/ad";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface MQGasSensorOptions {
  gnd?: number;
  vcc?: number;
  do?: number;
  ao?: number;
}

export default class MQGasSensor implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "MQGas",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public onchangeanalog?: (voltage: number) => void;
  public onexceedvoltage?: (voltage: number) => void;
  public onchangedigital?: (voltage: number) => void;
  public voltageLimit?: number;
  public params: any;
  protected obniz!: Obniz;
  private vcc!: number;
  private gnd!: number;
  private ad!: PeripheralAD;
  private do!: PeripheralIO;

  constructor() {
    this.keys = ["gnd", "vcc", "do", "ao"];
    this.requiredKeys = [];

    // this.RL = 2 * 1000;
    // this.RO = 20 * 1000;
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    this.vcc = this.params.vcc;
    this.gnd = this.params.gnd;

    if (this.obniz.isValidIO(this.params.ao)) {
      this.ad = obniz.getAD(this.params.ao);
      this.ad.start((voltage: any) => {
        // this.level = this.calc(voltage);
        if (typeof this.onchangeanalog === "function") {
          this.onchangeanalog(voltage);
        }
        if (
          typeof this.voltageLimit === "number" &&
          this.voltageLimit <= voltage &&
          typeof this.onexceedvoltage === "function"
        ) {
          this.onexceedvoltage(voltage);
        }
      });
    }

    if (this.obniz.isValidIO(this.params.do)) {
      this.do = obniz.getIO(this.params.do);
      this.do.input((value: any) => {
        if (typeof this.onchangedigital === "function") {
          this.onchangedigital(value);
        }
      });
    }
  }

  public startHeating() {
    this.obniz.setVccGnd(this.vcc, this.gnd, "5v");
  }

  public heatWait(seconds?: number): Promise<void> {
    this.startHeating();
    if (typeof seconds === "number" && seconds > 0) {
      seconds *= 1000;
    } else {
      seconds = 2 * 60 * 1000;
    }
    return new Promise((resolve: any) => {
      setTimeout(resolve, seconds);
    });
  }

  // Rs/Ro will descrease by insease of gas.
  // Rs = resitance 20k-100k. Ro = resistance of 1000ppm LPG
  // If RL =

  // calc(voltage) {

  //   if (voltage ===0) {
  //     voltage = 0.000001
  //   }
  //   const RS = this.RL / voltage * 5.0
  //   const ratio = RS / this.RO;

  //   return voltage;
  // }
}
