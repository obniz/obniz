/**
 * @packageDocumentation
 * @module Parts.Speaker
 */

import Obniz from "../../../obniz";
import PeripheralPWM from "../../../obniz/libs/io_peripherals/pwm";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface SpeakerOptions {
  signal: number;
  gnd?: number;
}

export default class Speaker implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Speaker",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  protected obniz!: Obniz;

  private pwm!: PeripheralPWM;

  constructor(obniz: any) {
    this.keys = ["signal", "gnd"];
    this.requiredKeys = ["signal"];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(null, this.params.gnd, "5v");
    this.pwm = obniz.getFreePwm();
    this.pwm.start({ io: this.params.signal });
  }

  public play(frequency: number) {
    if (typeof frequency !== "number") {
      throw new Error("freq must be a number");
    }
    frequency = Math.floor(frequency); // temporary
    if (frequency > 0) {
      this.pwm.freq(frequency);
      this.pwm.pulse((1 / frequency / 2) * 1000);
    } else {
      this.pwm.pulse(0);
    }
  }

  public stop() {
    this.play(0);
  }
}
