/**
 * @packageDocumentation
 * @module Parts.ServoMotor
 */

import Obniz from "../../../obniz";
import PeripheralPWM, { PWMInterface } from "../../../obniz/libs/io_peripherals/pwm";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface ServoMotorOptions {
  vcc?: number;
  gnd?: number;
  signal?: number;
  pwm?: PWMInterface;
}

export default class ServoMotor implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "ServoMotor",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public range = {
    min: 0.5,
    max: 2.4,
  };

  protected obniz!: Obniz;

  private pwm!: PeripheralPWM;
  private pwm_io_num?: number;
  private io_vcc: any;

  constructor() {
    this.keys = ["gnd", "vcc", "signal", "pwm"];
    this.requiredKeys = [];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    if (obniz.isValidIO(this.params.vcc)) {
      this.io_vcc = obniz.getIO(this.params.vcc);
    }

    if (this.params.pwm) {
      this.pwm = this.params.pwm;
    } else {
      this.pwm = obniz.getFreePwm();
      this.pwm_io_num = this.params.signal;
      if (typeof this.pwm_io_num !== "number") {
        throw new Error(`no io specified for pwm`);
      }
      this.pwm.start({ io: this.pwm_io_num });
    }
    this.pwm.freq(50);
  }

  // Module functions

  public angle(ratio: number) {
    const max = this.range.max;
    const min = this.range.min;
    const val = ((max - min) * ratio) / 180.0 + min;
    this.pwm.pulse(val);
  }

  public on() {
    if (this.io_vcc) {
      this.io_vcc.output(true);
    }
  }

  public off() {
    if (this.io_vcc) {
      this.io_vcc.output(false);
    }
  }
}
