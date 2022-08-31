/**
 * @packageDocumentation
 * @module Parts.MESH_100AC
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { Move } from '../utils/abstracts/MESHjs/block/Move';
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';

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
  public static readonly LocalName = /^MESH-100AC/;

  public accele: Move['accele'] = { x: 0, y: 0, z: 0 };

  // Event Handler
  public onTapped: ((accele: MESH_100AC['accele']) => void) | null = null;
  public onShaked: ((accele: MESH_100AC['accele']) => void) | null = null;
  public onFlipped: ((accele: MESH_100AC['accele']) => void) | null = null;
  public onOrientationChanged:
    | ((face: number, accele: MESH_100AC['accele']) => void)
    | null = null;

  protected readonly staticClass = MESH_100AC;

  /**
   * Check MESH block
   *
   * @param peripheral
   * @param opt_serialnumber
   * @returns
   */
  public static isMESHblock(
    peripheral: BleRemotePeripheral,
    opt_serialnumber = ''
  ): boolean {
    return Move.isMESHblock(peripheral.localName, opt_serialnumber);
  }

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
      if (typeof this.onOrientationChanged !== 'function') {
        return;
      }
      this.onOrientationChanged(face, accele);
    };

    super.prepareConnect();
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }
}
