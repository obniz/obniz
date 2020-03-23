/**
 * @packageDocumentation
 * @module Parts.Grove_Speaker
 */

import Obniz from "../../../obniz";
import PeripheralGrove from "../../../obniz/libs/io_peripherals/grove";
import PeripheralPWM from "../../../obniz/libs/io_peripherals/pwm";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

interface Grove_SpeakerOptionsA {
  vcc?: number;
  gnd?: number;
  signal: number;
}

interface Grove_SpeakerOptionsB {
  grove: PeripheralGrove;
}

export type Grove_SpeakerOptions = Grove_SpeakerOptionsA | Grove_SpeakerOptionsB;

export default class Grove_Speaker implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Grove_Speaker",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public pwm!: PeripheralPWM;

  protected obniz!: Obniz;

  constructor() {
    this.keys = ["vcc", "gnd", "signal", "grove"];
    this.requiredKeys = [];
  }

  public onchange(value: number) {}

  public wired(obniz: Obniz) {
    if (this.params.grove) {
      this.pwm = this.params.grove.getPwm();
    } else {
      this.obniz = obniz;
      this.obniz.setVccGnd(null, this.params.gnd, "5v");
      this.pwm = obniz.getFreePwm();
      this.pwm.start({ io: this.params.signal });
    }
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
