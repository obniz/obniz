/**
 * @packageDocumentation
 * @module Parts.MESH_100GP
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { MeshJsGp } from '../MESH_js/MeshJsGp';

export interface MESH_100GPOptions {}

/**
 * data from MESH_100GP
 */
export interface MESH_100GP_Data {
  name: string; // device name
  address: string; // bluetooth address
  battery: number; // battery (0 ~ 10)
}

/** MESH_100GA management class */
export default class MESH_100GP extends MESH<MESH_100GP_Data> {
  public static readonly PartsName = 'MESH_100GP';
  public static readonly PREFIX = 'MESH-100GP';

  public static readonly ANALOG_INPUT_EVENT_CONDITION =
    MeshJsGp.ANALOG_IN_EVENT_CONDITION;
  public static readonly MODE = MeshJsGp.MODE;
  public static readonly PIN = MeshJsGp.PIN;
  public static readonly STATE = MeshJsGp.STATE;
  public static readonly VCC = MeshJsGp.VCC;

  public readonly DigitalPins: MeshJsGp['DigitalPins'] = (this
    .meshBlock as MeshJsGp).DigitalPins;

  // Event Handler
  public onDigitalInEventNotify:
    | ((pin: number, state: number) => void)
    | null = null;
  public onAnalogInEventNotify: ((level: number) => void) | null = null;
  public onDigitalInNotify:
    | ((requestId: number, pin: number, state: number) => void)
    | null = null;
  public onAnalogInNotify:
    | ((requestId: number, state: number, mode: number) => void)
    | null = null;
  public onVOutNotify:
    | ((requestId: number, state: number) => void)
    | null = null;
  public onDigitalOutNotify:
    | ((requestId: number, pin: number, state: number) => void)
    | null = null;
  public onPwmNotify:
    | ((requestId: number, level: number) => void)
    | null = null;

  protected readonly staticClass = MESH_100GP;

  public async getDataWait() {
    this.checkConnected();
    return {
      name: this.peripheral.localName!,
      address: this.peripheral.address,
      battery: this.meshBlock.battery,
    };
  }

  /**
   * setMode
   *
   * @param digitalIn {p1:boolean, p2:boolean, p3:boolean}
   * @param digitalInNotify {p1:boolean, p2:boolean, p3:boolean}
   * @param digitalOut {p1:boolean, p2:boolean, p3:boolean}
   * @param pwmRatio 0 ~ 255
   * @param vcc VCC.AUTO or VCC.ON or VCC.OFF
   * @param analogInRangeUpper 0.00 ~ 3.00[V], resolution 0.05[V]
   * @param analogInRangeBottom 0.00 ~ 3.00[V], resolution 0.05[V]
   * @param analogInNotify AnalogInputEventCondition.NotNotify or AnalogInputEventCondition.AboveThreshold or AnalogInputEventCondition.BelowThreshold
   */
  public setMode(
    digitalIn: MESH_100GP['DigitalPins'],
    digitalInNotify: MESH_100GP['DigitalPins'],
    digitalOut: MESH_100GP['DigitalPins'],
    pwmRatio: number,
    vcc: number,
    analogInRangeUpper: number,
    analogInRangeBottom: number,
    analogInNotify: number
  ): void {
    const gpioBlock = this.meshBlock as MeshJsGp;
    const command = gpioBlock.parseSetmodeCommand(
      digitalIn,
      digitalInNotify,
      digitalOut,
      pwmRatio,
      vcc,
      analogInRangeUpper,
      analogInRangeBottom,
      analogInNotify
    );
    this.writeWOResponse(command);
  }

  public setDin(pin: number, opt_requestId = 0): void {
    const gpioBlock = this.meshBlock as MeshJsGp;
    const command = gpioBlock.parseSetDinCommand(pin, opt_requestId);
    this.writeWOResponse(command);
  }

  public setAin(mode: number, opt_requestId = 0) {
    const gpioBlock = this.meshBlock as MeshJsGp;
    const command = gpioBlock.parseSetAinCommand(mode, opt_requestId);
    this.writeWOResponse(command);
  }

  public setVout(pin: number, opt_requestId = 0) {
    const gpioBlock = this.meshBlock as MeshJsGp;
    const command = gpioBlock.parseSetVoutCommand(pin, opt_requestId);
    this.writeWOResponse(command);
  }

  public setDout(pin: number, opt_requestId = 0) {
    const gpioBlock = this.meshBlock as MeshJsGp;
    const command = gpioBlock.parseSetDoutCommand(pin, opt_requestId);
    this.writeWOResponse(command);
  }

  public setPWMNotify(opt_requestId = 0) {
    const gpioBlock = this.meshBlock as MeshJsGp;
    const command = gpioBlock.parseSetPWMCommand(opt_requestId);
    this.writeWOResponse(command);
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH_100GP.PREFIX) !== -1;
  }

  protected prepareConnect(): void {
    this.meshBlock = new MeshJsGp();
    const gpioBlock = this.meshBlock as MeshJsGp;

    gpioBlock.onDigitalInEventNotify = (pin: number, state: number) => {
      if (typeof this.onDigitalInEventNotify !== 'function') {
        return;
      }
      this.onDigitalInEventNotify(pin, state);
    };

    gpioBlock.onAnalogInEventNotify = (level: number) => {
      if (typeof this.onAnalogInEventNotify !== 'function') {
        return;
      }
      this.onAnalogInEventNotify(level);
    };

    gpioBlock.onDigitalInNotify = (
      requestId: number,
      pin: number,
      state: number
    ) => {
      if (typeof this.onDigitalInNotify !== 'function') {
        return;
      }
      this.onDigitalInNotify(requestId, pin, state);
    };

    gpioBlock.onAnalogInNotify = (
      requestId: number,
      state: number,
      mode: number
    ) => {
      if (typeof this.onAnalogInNotify !== 'function') {
        return;
      }
      this.onAnalogInNotify(requestId, state, mode);
    };

    gpioBlock.onVOutNotify = (requestId: number, state: number) => {
      if (typeof this.onVOutNotify !== 'function') {
        return;
      }
      this.onVOutNotify(requestId, state);
    };

    gpioBlock.onDigitalOutNotify = (
      requestId: number,
      pin: number,
      state: number
    ) => {
      if (typeof this.onDigitalOutNotify !== 'function') {
        return;
      }
      this.onDigitalOutNotify(requestId, pin, state);
    };

    gpioBlock.onPwmNotify = (requestId: number, level: number) => {
      if (typeof this.onPwmNotify !== 'function') {
        return;
      }
      this.onPwmNotify(requestId, level);
    };

    super.prepareConnect();
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }
}
