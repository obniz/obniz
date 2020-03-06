/**
 * @packageDocumentation
 * @module Parts.Keyestudio_Buzzer
 */

import Obniz from "../../../obniz";
import PeripheralPWM from "../../../obniz/libs/io_peripherals/pwm";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface Keyestudio_BuzzerOptions {
  signal: number;
  gnd?: number;
  vcc?: number;
}

export default class Keyestudio_Buzzer implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Keyestudio_Buzzer",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  protected obniz!: Obniz;

  private pwm!: PeripheralPWM;

  constructor() {
    this.keys = ["signal", "gnd", "vcc"];
    this.requiredKeys = ["signal"];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.pwm = obniz.getFreePwm();
    this.pwm.start({ io: this.params.signal });
  }

  public play(freq: number) {
    if (typeof freq !== "number") {
      throw new Error("freq must be a number");
    }
    freq = Math.floor(freq);
    if (freq > 0) {
      this.pwm.freq(freq);
      this.pwm.pulse((1 / freq / 2) * 1000);
    } else {
      this.pwm.pulse(0);
    }
  }

  public stop() {
    this.play(0);
  }
}
