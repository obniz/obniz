/**
 * @packageDocumentation
 * @module Parts.MESH_100GP
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { MESH_js_GP } from '../MESH_js/MESH_js_GP';

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
  public static readonly _LocalName = 'MESH-100GP';

  public static readonly AnalogInputEventCondition =
    MESH_js_GP.AnalogInputEventCondition;
  public static readonly Mode = MESH_js_GP.Mode;
  public static readonly Pin = MESH_js_GP.Pin;
  public static readonly State = MESH_js_GP.State;
  public static readonly VCC = MESH_js_GP.VCC;

  public readonly DigitalPins: MESH_js_GP['DigitalPins'] = (this
    ._mesh as MESH_js_GP).DigitalPins;

  // event handler
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
      battery: this._mesh.battery,
    };
  }

  /**
   * setMode
   *
   * @param din {p1:boolean, p2:boolean, p3:boolean}
   * @param din_notify {p1:boolean, p2:boolean, p3:boolean}
   * @param dout {p1:boolean, p2:boolean, p3:boolean}
   * @param pwm_ratio 0 ~ 255
   * @param vcc VCC.AUTO or VCC.ON or VCC.OFF
   * @param ain_range_upper 0.00 ~ 3.00[V], resolution 0.05[V]
   * @param ain_range_bottom 0.00 ~ 3.00[V], resolution 0.05[V]
   * @param ain_notify AnalogInputEventCondition.NotNotify or AnalogInputEventCondition.AboveThreshold or AnalogInputEventCondition.BelowThreshold
   */
  public setMode(
    din: MESH_100GP['DigitalPins'],
    din_notify: MESH_100GP['DigitalPins'],
    dout: MESH_100GP['DigitalPins'],
    pwm_ratio: number,
    vcc: number,
    ain_range_upper: number,
    ain_range_bottom: number,
    ain_notify: number
  ): void {
    const _gp = this._mesh as MESH_js_GP;
    this.writeWOResponse(
      _gp.parseSetmodeCommand(
        din,
        din_notify,
        dout,
        pwm_ratio,
        vcc,
        ain_range_upper,
        ain_range_bottom,
        ain_notify
      )
    );
  }

  public setDin(pin: number, request_id = 0): void {
    const _gp = this._mesh as MESH_js_GP;
    this.writeWOResponse(_gp.parseSetDinCommand(pin, request_id));
  }

  public setAin(mode: number, request_id = 0) {
    const _gp = this._mesh as MESH_js_GP;
    this.writeWOResponse(_gp.parseSetAinCommand(mode, request_id));
  }

  public setVout(pin: number, request_id = 0) {
    const _gp = this._mesh as MESH_js_GP;
    this.writeWOResponse(_gp.parseSetVoutCommand(pin, request_id));
  }

  public setDout(pin: number, request_id = 0) {
    const _gp = this._mesh as MESH_js_GP;
    this.writeWOResponse(_gp.parseSetDoutCommand(pin, request_id));
  }

  public setPWMNotify(request_id = 0) {
    const _gp = this._mesh as MESH_js_GP;
    this.writeWOResponse(_gp.parseSetPWMCommand(request_id));
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH_100GP._LocalName) !== -1;
  }

  protected prepareConnect(): void {
    this._mesh = new MESH_js_GP();
    const _gp = this._mesh as MESH_js_GP;

    _gp.onDigitalInEventNotify = (pin: number, state: number) => {
      if (typeof this.onDigitalInEventNotify !== 'function') {
        return;
      }
      this.onDigitalInEventNotify(pin, state);
    };

    _gp.onAnalogInEventNotify = (level: number) => {
      if (typeof this.onAnalogInEventNotify !== 'function') {
        return;
      }
      this.onAnalogInEventNotify(level);
    };

    _gp.onDigitalInNotify = (requestId: number, pin: number, state: number) => {
      if (typeof this.onDigitalInNotify !== 'function') {
        return;
      }
      this.onDigitalInNotify(requestId, pin, state);
    };

    _gp.onAnalogInNotify = (requestId: number, state: number, mode: number) => {
      if (typeof this.onAnalogInNotify !== 'function') {
        return;
      }
      this.onAnalogInNotify(requestId, state, mode);
    };

    _gp.onVOutNotify = (requestId: number, state: number) => {
      if (typeof this.onVOutNotify !== 'function') {
        return;
      }
      this.onVOutNotify(requestId, state);
    };

    _gp.onDigitalOutNotify = (
      requestId: number,
      pin: number,
      state: number
    ) => {
      if (typeof this.onDigitalOutNotify !== 'function') {
        return;
      }
      this.onDigitalOutNotify(requestId, pin, state);
    };

    _gp.onPwmNotify = (requestId: number, level: number) => {
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
