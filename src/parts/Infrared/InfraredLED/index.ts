/**
 * @packageDocumentation
 * @module Parts.InfraredLED
 */

import Obniz from "../../../obniz";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";
import PeripheralPWM from "../../../obniz/libs/io_peripherals/pwm";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface InfraredLEDOptions {
  anode: number;
  cathode?: number;
}

export default class InfraredLED implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "InfraredLED",
    };
  }

  public keys: string[];
  public requiredKeys: string[];

  public dataSymbolLength = 0.07;
  public params: any;

  protected obniz!: Obniz;

  private io_cathode?: PeripheralIO;
  private pwm!: PeripheralPWM;

  constructor() {
    this.keys = ["anode", "cathode"];
    this.requiredKeys = ["anode"];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    if (!this.obniz.isValidIO(this.params.anode)) {
      throw new Error("anode is not valid io");
    }
    if (this.params.cathode) {
      if (!this.obniz.isValidIO(this.params.cathode)) {
        throw new Error("cathode is not valid io");
      }
      this.io_cathode = obniz.getIO(this.params.cathode);
      this.io_cathode.output(false);
    }
    this.pwm = this.obniz.getFreePwm();
    this.pwm.start({ io: this.params.anode });
    this.pwm.freq(38000);
    this.obniz.wait(150); // TODO: this is instant fix for pwm start delay
  }

  public send(data: Array<0 | 1>) {
    if (data && data.length > 0 && data[data.length - 1] === 1) {
      data.push(0);
    }
    this.pwm.modulate("am", this.dataSymbolLength, data);
  }
}
