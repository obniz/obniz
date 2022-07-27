/**
 * @packageDocumentation
 * @module Parts.MESH_100MD
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { MeshJsMd } from '../MESH_js/MeshJsMd';

export interface MESH_100MDOptions {}

/**
 * advertisement data from MESH_100MD
 */
export interface MESH_100MD_Data {
  name: string;
  address: string;
  battery: number /** battery (0 ~ 10) */;
  motion_state: number;
  detection_mode: number;
  request_id: number;
}

/** MESH_100MD management class */
export default class MESH_100MD extends MESH<MESH_100MD_Data> {
  public static readonly PartsName = 'MESH_100MD';
  public static readonly PREFIX = 'MESH-100MD';

  // Event Handler
  public onNotify: ((resp: MeshJsMd['response_']) => void) | null = null;

  protected readonly staticClass = MESH_100MD;

  public async getDataWait() {
    this.checkConnected();
    const _md = this._mesh as MeshJsMd;
    return {
      name: this.peripheral!.localName!,
      address: this.peripheral.address,
      battery: this._mesh.battery,
      motion_state: _md.getResponse.motionState,
      detection_mode: _md.getResponse.detectionMode,
      request_id: _md.getResponse.requestId,
    };
  }

  public setMode(
    detection_mode: number,
    opt_detection_time = 500,
    opt_response_time = 500,
    opt_requestid = 0
  ): void {
    const _md = this._mesh as MeshJsMd;
    this.writeWOResponse(
      _md.parseSetmodeCommand(
        detection_mode,
        opt_detection_time,
        opt_response_time,
        opt_requestid
      )
    );
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH_100MD.PREFIX) !== -1;
  }

  protected prepareConnect(): void {
    this._mesh = new MeshJsMd();

    // set Event handler
    const _md = this._mesh as MeshJsMd;
    _md.onNotify = (response: MeshJsMd['response_']) => {
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
