/**
 * @packageDocumentation
 * @module Parts.MESH_100TH
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { MESH_js_TH } from '../MESH_js/MESH_js_TH';

export interface MESH_100THOptions {}

/**
 * advertisement data from MESH_100TH
 */
export interface MESH_100TH_Data {
  name: string;
  address: string;
  battery: number; // 0 ~ 10
  temperature: number; // -10 ~ 50 [Celsius]
  humidity: number; // 0 ~ 100 [%]
}

/** MESH_100TH management class */
export default class MESH_100TH extends MESH<MESH_100TH_Data> {
  public static readonly PartsName = 'MESH_100TH';
  public static readonly _LocalName = 'MESH-100TH';

  public static readonly NotifyType = MESH_js_TH.NotifyType;

  public onNotify: ((resp: MESH_js_TH['response']) => void) | null = null;

  protected readonly staticClass = MESH_100TH;

  public async getDataWait() {
    this.checkConnected();
    const _th = this._mesh as MESH_js_TH;
    return {
      name: this.peripheral.localName!,
      address: this.peripheral.address,
      battery: this._mesh.battery,
      temperature: _th.getResponse.temperature,
      humidity: _th.getResponse.humidity,
    };
  }

  public setMode(
    temperature_upper: number,
    temperature_bottom: number,
    temperature_condition: number,
    humidity_upper: number,
    humidity_bottom: number,
    humidity_condision: number,
    type: number,
    request_id = 0
  ): void {
    const _th = this._mesh as MESH_js_TH;
    this.writeWOResponse(
      _th.parseSetmodeCommand(
        temperature_upper,
        temperature_bottom,
        humidity_upper,
        humidity_bottom,
        temperature_condition,
        humidity_condision,
        type,
        request_id
      )
    );
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH_100TH._LocalName) !== -1;
  }

  protected prepareConnect(): void {
    this._mesh = new MESH_js_TH();
    const _th = this._mesh as MESH_js_TH;
    _th.onNotify = (response: MESH_js_TH['response']) => {
      if (typeof this.onNotify !== 'function') {
        return;
      }
      this.onNotify(response);
    };
    super.prepareConnect();
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }
}
