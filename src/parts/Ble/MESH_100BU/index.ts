/**
 * @packageDocumentation
 * @module Parts.MESH_100BU
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { MeshJsBu } from '../MESH_js/MeshJsBu';

export interface MESH_100BUOptions {}

/**
 * advertisement data from MESH_100BU
 */
export interface MESH_100BU_Data {
  name: string;
  address: string;
  battery: number;
}

/** MESH_100BU management class */
export default class MESH_100BU extends MESH<MESH_100BU_Data> {
  public static readonly PartsName = 'MESH_100BU';
  public static readonly PREFIX = 'MESH-100BU' as const;

  /** Event Handler */
  public onSinglePressed: (() => void) | null = null;
  public onLongPressed: (() => void) | null = null;
  public onDoublePressed: (() => void) | null = null;

  protected readonly staticClass = MESH_100BU;

  public async getDataWait() {
    this.checkConnected();
    return {
      name: this.peripheral.localName!,
      address: this.peripheral.address,
      battery: this._mesh.battery,
    };
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH_100BU.PREFIX) !== -1;
  }

  protected prepareConnect(): void {
    this._mesh = new MeshJsBu();

    const _bu = this._mesh as MeshJsBu;
    _bu.onSinglePressed = () => {
      if (typeof this.onSinglePressed !== 'function') {
        return;
      }
      this.onSinglePressed();
    };
    _bu.onLongPressed = () => {
      if (typeof this.onLongPressed !== 'function') {
        return;
      }
      this.onLongPressed();
    };
    _bu.onDoublePressed = () => {
      if (typeof this.onDoublePressed !== 'function') {
        return;
      }
      this.onDoublePressed();
    };
    super.prepareConnect();
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }
}
