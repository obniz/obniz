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
}

/** MESH_100AC management class */
export default class MESH_100AC extends MESH<MESH_100AC_Data> {
  public static readonly PartsName = 'MESH_100AC';
  public static readonly PREFIX = 'MESH-100AC';

  // Event Handler
  public onTapped:
    | ((acceleX: number, acceleY: number, acceleZ: number) => void)
    | null = null;
  public onShaked:
    | ((acceleX: number, acceleY: number, acceleZ: number) => void)
    | null = null;
  public onFlipped:
    | ((acceleX: number, acceleY: number, acceleZ: number) => void)
    | null = null;
  public onOrientation:
    | ((
        face: number,
        acceleX: number,
        acceleY: number,
        acceleZ: number
      ) => void)
    | null = null;

  protected readonly staticClass = MESH_100AC;

  public async getDataWait() {
    this.checkConnected();
    return {
      name: this.peripheral.localName!,
      address: this.peripheral.address,
      battery: this.meshBlock.battery,
    };
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH_100AC.PREFIX) === 0;
  }

  protected prepareConnect(): void {
    this.meshBlock = new MeshJsAc();

    const moveBlock = this.meshBlock as MeshJsAc;
    moveBlock.onTapped = (
      acceleX: number,
      acceleY: number,
      acceleZ: number
    ) => {
      if (typeof this.onTapped !== 'function') {
        return;
      }
      this.onTapped(acceleX, acceleY, acceleZ);
    };
    moveBlock.onShaked = (
      acceleX: number,
      acceleY: number,
      acceleZ: number
    ) => {
      if (typeof this.onShaked !== 'function') {
        return;
      }
      this.onShaked(acceleX, acceleY, acceleZ);
    };
    moveBlock.onFlipped = (
      acceleX: number,
      acceleY: number,
      acceleZ: number
    ) => {
      if (typeof this.onFlipped !== 'function') {
        return;
      }
      this.onFlipped(acceleX, acceleY, acceleZ);
    };
    moveBlock.onOrientation = (
      face: number,
      acceleX: number,
      acceleY: number,
      acceleZ: number
    ) => {
      if (typeof this.onOrientation !== 'function') {
        return;
      }
      this.onOrientation(face, acceleX, acceleY, acceleZ);
    };

    super.prepareConnect();
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }
}
