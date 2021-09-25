/**
 * @packageDocumentation
 * @module Parts.DCMotor
 */

import Obniz from '../../../obniz';
import PeripheralPWM from '../../../obniz/libs/io_peripherals/pwm';

import ObnizPartsInterface, {
  ObnizPartsInfo,
} from '../../../obniz/ObnizPartsInterface';

export interface DCMotorOptions {
  forward: number;
  back: number;
}

export interface DCMotorStatus {
  direction: boolean | null;
  power: number;
}

export default class DCMotor implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: 'DCMotor',
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public status: DCMotorStatus;
  public params: any;

  public forward_io_num: any;
  public back_io_num: any;

  public pwm!: PeripheralPWM;
  public obniz!: Obniz;

  constructor() {
    this.keys = ['forward', 'back'];
    this.requiredKeys = ['forward', 'back'];
    this.status = {
      direction: null,
      power: 30,
    };
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    this.forward_io_num = this.params.forward;
    this.back_io_num = this.params.back;

    this.pwm = obniz.getFreePwm();
    this.setPwmGnd(this.forward_io_num, this.back_io_num);
    this.power(this.status.power);
  }

  // Module functions

  public forward() {
    this.move(true);
  }

  public reverse() {
    this.move(false);
  }

  public stop() {
    if (this.status.direction === null) {
      return;
    }
    this.status.direction = null;
    this.pwm.duty(0);
  }

  public move(forward: any) {
    if (forward) {
      if (this.status.direction === true) {
        return;
      }
      this.status.direction = true;
    } else {
      if (this.status.direction === false) {
        return;
      }
      this.status.direction = false;
    }
    const power: any = this.power();
    this.power(0);
    this.power(power);
  }

  public power(power?: number) {
    if (power === undefined) {
      return this.status.power;
    }
    this.status.power = power;

    if (this.status.direction === null) {
      this.pwm.duty(0);
      return;
    }

    const pwm_io = this.status.direction
      ? this.forward_io_num
      : this.back_io_num;
    const gnd_io = this.status.direction
      ? this.back_io_num
      : this.forward_io_num;

    this.setPwmGnd(pwm_io, gnd_io);
    this.pwm.duty(power);
  }

  private setPwmGnd(pwm_io: number, gnd_io: number) {
    this.pwm.start({ io: pwm_io });
    this.pwm.freq(100000);
    this.obniz.display?.setPinName(pwm_io, 'DCMotor', 'pwm');
    this.obniz.getIO(gnd_io).output(false);
    this.obniz.display?.setPinName(gnd_io, 'DCMotor', 'gnd');
  }
}
