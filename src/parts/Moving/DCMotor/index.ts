/**
 * @packageDocumentation
 * @module Parts.DCMotor
 */

import Obniz from '../../../obniz';
import { PeripheralPWM } from '../../../obniz/libs/io_peripherals/pwm';

import {
  ObnizPartsInterface,
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
    this.setPwmGndPin(this.forward_io_num, this.back_io_num);
  }

  // Module functions

  /**
   * Start rotation to the forward direction.
   */
  public forward(): void {
    this.move(true);
  }

  /**
   * Start rotation to the reverse direction.
   */
  public reverse(): void {
    this.move(false);
  }

  /**
   * Stop rotation.
   */
  public stop(): void {
    if (this.status.direction === null) {
      return;
    }
    this.status.direction = null;
    this.pwm.duty(0);
  }

  /**
   * Start rotation by specifying rotation direction.
   *
   * @param forward true is forward rotation, and false is reverse rotation.
   */
  public move(forward?: boolean): void {
    if (forward === undefined) {
      if (this.status.direction === null) {
        return;
      }
    } else {
      if (this.status.direction === forward) {
        return;
      }
      this.status.direction = forward;
    }

    const pwm_io = this.status.direction
      ? this.forward_io_num
      : this.back_io_num;
    const gnd_io = this.status.direction
      ? this.back_io_num
      : this.forward_io_num;

    this.setPwmGndPin(pwm_io, gnd_io);
    this.pwm.duty(this.status.power);
  }

  /**
   * Set the motor power.
   *
   * @param power Specify between 0 and 100.
   */
  public power(power: number): void {
    this.status.power = power;
    if (this.status.direction !== null) {
      this.pwm.duty(this.status.power);
    }
  }

  private setPwmGndPin(pwm_io: number, gnd_io: number) {
    this.pwm.start({ io: pwm_io });
    this.pwm.freq(100000);
    this.obniz.getIO(gnd_io).output(false);
    this.obniz.display?.setPinNames(DCMotor.info().name, {
      [this.forward_io_num]: 'forward',
      [this.back_io_num]: 'back',
    });
  }
}
