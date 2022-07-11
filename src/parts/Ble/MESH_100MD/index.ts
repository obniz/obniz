/**
 * @packageDocumentation
 * @module Parts.MESH_100MD
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { MESH_js_MD } from '../MESH_js/MESH_js_MD';

export interface MESH_100MDOptions {}

/**
 * advertisement data from MESH_100MD
 */
export interface MESH_100MD_Data {
  address: string;
  battery: number /** battery (0 ~ 10) */;
  motion_state: number;
  detection_mode: number;
}

/** MESH_100MD management class */
export default class MESH_100MD extends MESH<MESH_100MD_Data> {
  public static readonly PartsName = 'MESH_100MD';
  public static readonly _LocalName = 'MESH-100MD';

  // event handler
  public onNotify: ((resp: MESH_js_MD['response']) => void) | null = null;

  protected readonly staticClass = MESH_100MD;

  public async getDataWait() {
    this.checkConnected();
    const _md = this._mesh as MESH_js_MD;
    return {
      localname: this.peripheral.localName,
      address: this.peripheral.address,
      battery: this._mesh.battery,
      motion_state: _md.getResponse.motion_state,
      detection_mode: _md.getResponse.detection_mode,
    };
  }

  public setMode(
    detection_mode: number,
    detection_time = 500,
    response_time = 500,
    requestid = 0
  ): void {
    const _md = this._mesh as MESH_js_MD;
    this.writeWOResponse(
      _md.parseSetmodeCommand(
        detection_mode,
        detection_time,
        response_time,
        requestid
      )
    );
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH_100MD._LocalName) !== -1;
  }

  protected prepareConnect(): void {
    this._mesh = new MESH_js_MD();

    // set Event handler
    const _md = this._mesh as MESH_js_MD;
    _md.onNotify = (response: MESH_js_MD['response']) => {
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
