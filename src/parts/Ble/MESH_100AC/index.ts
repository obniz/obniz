/**
 * @packageDocumentation
 * @module Parts.MESH_100AC
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { MeshJsAc } from '../MESH_js/MeshJsAc';

export interface MESH_100ACOptions {}

/**
 * advertisement data from MESH_100AC
 */
export interface MESH_100AC_Data {
  name: string;
  address: string;
  battery: number; // 0 ~ 10
  accele_x: number;
  accele_y: number;
  accele_z: number;
  face: number;
}

/** MESH_100AC management class */
export default class MESH_100AC extends MESH<MESH_100AC_Data> {
  public static readonly PartsName = 'MESH_100AC';
  public static readonly PREFIX = 'MESH-100AC';

  // Event Handler
  public onTapped: ((accele: MeshJsAc['accele_']) => void) | null = null;
  public onShaked: ((accele: MeshJsAc['accele_']) => void) | null = null;
  public onFlipped: ((accele: MeshJsAc['accele_']) => void) | null = null;
  public onDirection:
    | ((face: number, accele: MeshJsAc['accele_']) => void)
    | null = null;

  protected readonly staticClass = MESH_100AC;

  public async getDataWait() {
    this.checkConnected();

    const _ac = this._mesh as MeshJsAc;
    return {
      name: this.peripheral.localName!,
      address: this.peripheral.address,
      battery: this._mesh.battery,
      accele_x: _ac.getAccele.x,
      accele_y: _ac.getAccele.y,
      accele_z: _ac.getAccele.z,
      face: _ac.getFace,
    };
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH_100AC.PREFIX) === 0;
  }

  protected prepareConnect(): void {
    this._mesh = new MeshJsAc();

    const _ac = this._mesh as MeshJsAc;
    _ac.onTapped = (accele: MeshJsAc['accele_']) => {
      if (typeof this.onTapped !== 'function') {
        return;
      }
      this.onTapped(accele);
    };
    _ac.onShaked = (accele: MeshJsAc['accele_']) => {
      if (typeof this.onShaked !== 'function') {
        return;
      }
      this.onShaked(accele);
    };
    _ac.onFlipped = (accele: MeshJsAc['accele_']) => {
      if (typeof this.onFlipped !== 'function') {
        return;
      }
      this.onFlipped(accele);
    };
    _ac.onDirection = (face: number, accele: MeshJsAc['accele_']) => {
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
