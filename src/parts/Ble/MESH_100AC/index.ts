/**
 * @packageDocumentation
 * @module Parts.MESH_100AC
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { Move } from '../MESH_js/block/Move';

export interface MESH_100ACOptions {}

/**
 * advertisement data from MESH_100AC
 */
export interface MESH_100AC_Data {
  name: string;
  address: string;
}

/** MESH_100AC management class */
export default class MESH_100AC extends MESH<MESH_100AC_Data> {
  public static readonly PartsName = 'MESH_100AC';
  public static readonly PREFIX = 'MESH-100AC';

  public accele: Move['accele'] = { x: 0, y: 0, z: 0 };

  // Event Handler
  public onTapped: ((accele: MESH_100AC['accele']) => void) | null = null;
  public onShaked: ((accele: MESH_100AC['accele']) => void) | null = null;
  public onFlipped: ((accele: MESH_100AC['accele']) => void) | null = null;
  public onOrientation:
    | ((face: number, accele: MESH_100AC['accele']) => void)
    | null = null;

  protected readonly staticClass = MESH_100AC;

  /**
   * getDataWait
   *
   * @returns
   */
  public async getDataWait() {
    this.checkConnected();
    return {
      name: this.peripheral.localName!,
      address: this.peripheral.address,
    };
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH_100AC.PREFIX) === 0;
  }

  protected prepareConnect(): void {
    this.meshBlock = new Move();

    const moveBlock = this.meshBlock as Move;
    moveBlock.onTapped = (accele: MESH_100AC['accele']) => {
      if (typeof this.onTapped !== 'function') {
        return;
      }
      this.onTapped(accele);
    };
    moveBlock.onShaked = (accele: MESH_100AC['accele']) => {
      if (typeof this.onShaked !== 'function') {
        return;
      }
      this.onShaked(accele);
    };
    moveBlock.onFlipped = (accele: MESH_100AC['accele']) => {
      if (typeof this.onFlipped !== 'function') {
        return;
      }
      this.onFlipped(accele);
    };
    moveBlock.onOrientationChanged = (
      face: number,
      accele: MESH_100AC['accele']
    ) => {
      if (typeof this.onOrientation !== 'function') {
        return;
      }
      this.onOrientation(face, accele);
    };

    super.prepareConnect();
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }
}
