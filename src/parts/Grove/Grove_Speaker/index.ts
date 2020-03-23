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
  public value?: number;

  protected obniz!: Obniz;

  constructor() {
    this.keys = ["vcc", "gnd", "signal", "grove"];
    this.requiredKeys = [];
  }

  public onchange(value: number) {}

  public wired(obniz: Obniz) {
    if (this.params.grove) {
      const grovePwm = this.params.grove.getDigital();
      this.pwm = grovePwm.primary;
    } else {
      this.obniz = obniz;
      this.obniz.setVccGnd(null, this.params.gnd, "5v");
      this.pwm = obniz.getFreePwm();
      this.pwm.start({ io: this.params.signal });
    }
  }
}
