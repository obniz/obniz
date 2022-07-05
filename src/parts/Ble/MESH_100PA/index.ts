/**
 * @packageDocumentation
 * @module Parts.MESH_100PA
 */
/* eslint rulesdir/non-ascii: 0 */

import {
  ObnizPartsBleMode,
  ObnizPartsBleProps,
} from '../../../obniz/ObnizPartsBleAbstract';
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { MESH } from '../utils/abstracts/MESH';
import { MESH_PA } from '../MESH_js';
import { textSpanIntersectsWith } from 'typescript';

export interface MESH_100PAOptions {}

/**
 * advertisement data from MESH_100LE
 */
export interface MESH_100PA_Data {
  /** battery 電源電圧 (Unit 単位: 0.01 V) */
  battery: number;
}

/** MESH_100PA management class */
export default class MESH_100PA extends MESH<MESH_100PA_Data> {
  public static readonly PartsName = 'MESH_100PA';
  public static readonly _LocalName = 'MESH-100PA';
  public static AvailableBleMode = 'Connectable' as const;
  protected readonly staticClass = MESH_100PA;

  protected static _isMESHblock(name: string) {
    return name.indexOf(MESH_100PA._LocalName) !== -1;
  }

  protected prepareConnect() {
    this._mesh = new MESH_PA();
    super.prepareConnect();
  }

  protected _notify(data: any) {
    // console.log('data : ' + data);
    const res = this._mesh.notify(data);
    // console.log('res: ' + res);
    //  this.getDataWait();
  }

  public async getDataWait() {
    this.checkConnected();
    return {
      battery: this._mesh.getBattery(),
    };
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }
}
