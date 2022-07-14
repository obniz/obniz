/**
 * @packageDocumentation
 * @module Parts.MESH_100GP
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { MESH_js_GP } from '../MESH_js/MESH_js_GP';

export interface MESH_100GPOptions {}

/**
 * advertisement data from MESH_100GP
 */
export interface MESH_100GP_Data {
  name: string;
  address: string;
  /** battery (0 ~ 10) */
  battery: number;
}

/** MESH_100PA management class */
export default class MESH_100GP extends MESH<MESH_100GP_Data> {
  public static readonly PartsName = 'MESH_100GP';
  public static readonly _LocalName = 'MESH-100GP';

  // event handler
  public onDinEvent: ((pin: number, state: number) => void) | null = null;
  public onAinEvent:
    | ((pin: number, type: number, threshold: number, level: number) => void)
    | null = null;
  public onDinState:
    | ((requestId: number, pin: number, state: number) => void)
    | null = null;
  public onAinState:
    | ((requestId: number, pin: number, state: number, mode: number) => void)
    | null = null;
  public onVoutState:
    | ((requestId: number, pin: number, state: number) => void)
    | null = null;
  public onDoutState:
    | ((requestId: number, pin: number, state: number) => void)
    | null = null;
  public onPWMoutState:
    | ((requestId: number, pin: number, level: number) => void)
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

  public setMode(
    din: number,
    din_notify: number,
    dout: number,
    pwm_ratio: number,
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
        ain_range_upper,
        ain_range_bottom,
        ain_notify
      )
    );
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH_100GP._LocalName) !== -1;
  }

  protected prepareConnect(): void {
    this._mesh = new MESH_js_GP();

    const _gp = this._mesh as MESH_js_GP;
    _gp.onDinEvent = (pin: number, state: number) => {
      if (typeof this.onDinEvent !== 'function') {
        return;
      }
      this.onDinEvent(pin, state);
    };
    _gp.onAinEvent = (
      pin: number,
      type: number,
      threshold: number,
      level: number
    ) => {
      if (typeof this.onAinEvent !== 'function') {
        return;
      }
      this.onAinEvent(pin, type, threshold, level);
    };
    _gp.onDinState = (requestId: number, pin: number, state: number) => {
      if (typeof this.onDinState !== 'function') {
        return;
      }
      this.onDinState(requestId, pin, state);
    };
    _gp.onAinState = (
      requestId: number,
      pin: number,
      state: number,
      mode: number
    ) => {
      if (typeof this.onAinState !== 'function') {
        return;
      }
      this.onAinState(requestId, pin, state, mode);
    };
    _gp.onVoutState = (requestId: number, pin: number, state: number) => {
      if (typeof this.onVoutState !== 'function') {
        return;
      }
      this.onVoutState(requestId, pin, state);
    };
    _gp.onDoutState = (requestId: number, pin: number, state: number) => {
      if (typeof this.onDoutState !== 'function') {
        return;
      }
      this.onDoutState(requestId, pin, state);
    };
    _gp.onPWMoutState = (requestId: number, pin: number, level: number) => {
      if (typeof this.onPWMoutState !== 'function') {
        return;
      }
      this.onPWMoutState(requestId, pin, level);
    };

    super.prepareConnect();
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }
}
