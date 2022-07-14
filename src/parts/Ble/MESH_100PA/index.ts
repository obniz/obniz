/**
 * @packageDocumentation
 * @module Parts.MESH_100PA
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { MESH_js_PA } from '../MESH_js/MESH_js_PA';

export interface MESH_100PAOptions {}

/**
 * advertisement data from MESH_100PA
 */
export interface MESH_100PA_Data {
  name: string;
  address: string;
  /** battery (0 ~ 10) */
  battery: number;
  proximity: number;
  brightness: number;
}

/** MESH_100PA management class */
export default class MESH_100PA extends MESH<MESH_100PA_Data> {
  public static readonly PartsName = 'MESH_100PA';
  public static readonly _LocalName = 'MESH-100PA';

  // event handler
  public onNotify: ((resp: MESH_js_PA['response']) => void) | null = null;

  protected readonly staticClass = MESH_100PA;

  public async getDataWait() {
    this.checkConnected();
    const _pa = this._mesh as MESH_js_PA;
    return {
      name: this.peripheral.localName!,
      address: this.peripheral.address,
      battery: this._mesh.battery,
      proximity: _pa.getResponse.proximity,
      brightness: _pa.getResponse.brightness,
    };
  }

  public setMode(type: number): void {
    const _pa = this._mesh as MESH_js_PA;
    this.writeWOResponse(_pa.parseSetmodeCommand(type));
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH_100PA._LocalName) !== -1;
  }

  protected prepareConnect(): void {
    this._mesh = new MESH_js_PA();
    const _pa = this._mesh as MESH_js_PA;
    _pa.onNotify = (response: MESH_js_PA['response']) => {
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
