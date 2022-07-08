/**
 * @packageDocumentation
 * @module Parts.MESH_100AC
 */
/* eslint rulesdir/non-ascii: 0 */

import {
  ObnizPartsBleMode,
  ObnizPartsBleProps,
} from '../../../obniz/ObnizPartsBleAbstract';
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { MESH } from '../utils/abstracts/MESH';
import { MESH_AC } from '../MESH_js';
import { textSpanIntersectsWith } from 'typescript';

export interface MESH_100ACOptions {}

/**
 * advertisement data from MESH_100AC
 */
export interface MESH_100AC_Data {
  /** battery 電源電圧 (Unit 単位: 0.01 V) */
  battery: number;
  /** temperature 温度 (Unit 単位: 0.01 degC)*/
  /** humidity 相対湿度 (Unit 単位: 1% RH) */
  accele_x: number;
  accele_y: number;
  accele_z: number;
  face: number;
}

/** MESH_100AC management class */
export default class MESH_100AC extends MESH<MESH_100AC_Data> {
  public static readonly PartsName = 'MESH_100AC';
  public static readonly _LocalName = 'MESH-100AC';
  public static AvailableBleMode = 'Connectable' as const;
  protected readonly staticClass = MESH_100AC;

  public onTapped: ((accele: MESH_AC['accele']) => void) | null = null;
  public onShaked: ((accele: MESH_AC['accele']) => void) | null = null;
  public onFlipped: ((accele: MESH_AC['accele']) => void) | null = null;
  public onDirection:
    | ((face: number, accele: MESH_AC['accele']) => void)
    | null = null;

  protected static _isMESHblock(name: string) {
    return name.indexOf(MESH_100AC._LocalName) !== -1;
  }

  protected prepareConnect() {
    this._mesh = new MESH_AC();
    (this._mesh as MESH_AC).onTapped = (accele: MESH_AC['accele']) => {
      if (typeof this.onTapped !== 'function') {
        return;
      }
      this.onTapped(accele);
    };
    (this._mesh as MESH_AC).onShaked = (accele: MESH_AC['accele']) => {
      if (typeof this.onShaked !== 'function') {
        return;
      }
      this.onShaked(accele);
    };
    (this._mesh as MESH_AC).onFlipped = (accele: MESH_AC['accele']) => {
      if (typeof this.onFlipped !== 'function') {
        return;
      }
      this.onFlipped(accele);
    };
    (this._mesh as MESH_AC).onDirection = (
      face: number,
      accele: MESH_AC['accele']
    ) => {
      if (typeof this.onDirection !== 'function') {
        return;
      }
      this.onDirection(face, accele);
    };
    super.prepareConnect();
  }

  protected _notify(data: any) {
    this._mesh.notify(data);
    //  this.getDataWait();
  }

  public async getDataWait() {
    this.checkConnected();
    (this._mesh as MESH_AC).printData();
    return {
      localname: this.peripheral.localName,
      address: this.peripheral.address,
      battery: this._mesh.battery,
      accele_x: (this._mesh as MESH_AC).getAccele().x,
      accele_y: (this._mesh as MESH_AC).getAccele().y,
      accele_z: (this._mesh as MESH_AC).getAccele().z,
      face: (this._mesh as MESH_AC).getFace(),
    };
  }

  public async writeTestWait() {
    await this._writeWOCharacteristic?.writeWait([1, 1, 15, 0, 2, 19]);
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }
}
