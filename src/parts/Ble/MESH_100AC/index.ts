/**
 * @packageDocumentation
 * @module Parts.MESH_100AC
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { MESH_js_AC } from '../MESH_js/MESH_js_AC';

export interface MESH_100ACOptions {}

/**
 * advertisement data from MESH_100AC
 */
export interface MESH_100AC_Data {
  /** battery (0 ~ 10) */
  battery: number;
  accele_x: number;
  accele_y: number;
  accele_z: number;
  face: number;
}

/** MESH_100AC management class */
export default class MESH_100AC extends MESH<MESH_100AC_Data> {
  public static readonly PartsName = 'MESH_100AC';
  public static readonly _LocalName = 'MESH-100AC';

  // event handler
  public onTapped: ((accele: MESH_js_AC['accele']) => void) | null = null;
  public onShaked: ((accele: MESH_js_AC['accele']) => void) | null = null;
  public onFlipped: ((accele: MESH_js_AC['accele']) => void) | null = null;
  public onDirection:
    | ((face: number, accele: MESH_js_AC['accele']) => void)
    | null = null;

  protected readonly staticClass = MESH_100AC;

  public async getDataWait() {
    this.checkConnected();

    const _ac = this._mesh as MESH_js_AC;
    return {
      localname: this.peripheral.localName,
      address: this.peripheral.address,
      battery: this._mesh.battery,
      accele_x: _ac.getAccele.x,
      accele_y: _ac.getAccele.y,
      accele_z: _ac.getAccele.z,
      face: _ac.getFace,
    };
  }

  // public setMode(event: number, mode: number, requestid = 0): void {
  //   if (!this._writeCharacteristic) {
  //     return;
  //   }
  //   const _ac = this._mesh as MESH_js_AC;
  //   this._writeCharacteristic
  //     .writeWait(_ac.parseSetmodeCommand(event, mode, requestid))
  //     .then((resp) => {
  //       console.log('response: ' + resp);
  //     });
  // }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH_100AC._LocalName) === 0;
  }

  protected prepareConnect(): void {
    this._mesh = new MESH_js_AC();

    const _ac = this._mesh as MESH_js_AC;
    _ac.onTapped = (accele: MESH_js_AC['accele']) => {
      if (typeof this.onTapped !== 'function') {
        return;
      }
      this.onTapped(accele);
    };
    _ac.onShaked = (accele: MESH_js_AC['accele']) => {
      if (typeof this.onShaked !== 'function') {
        return;
      }
      this.onShaked(accele);
    };
    _ac.onFlipped = (accele: MESH_js_AC['accele']) => {
      if (typeof this.onFlipped !== 'function') {
        return;
      }
      this.onFlipped(accele);
    };
    _ac.onDirection = (face: number, accele: MESH_js_AC['accele']) => {
      if (typeof this.onDirection !== 'function') {
        return;
      }
      this.onDirection(face, accele);
    };

    super.prepareConnect();
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }
}
