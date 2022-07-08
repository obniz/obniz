/**
 * @packageDocumentation
 * @module Parts.MESH_100MD
 */
/* eslint rulesdir/non-ascii: 0 */

import {
  ObnizPartsBleMode,
  ObnizPartsBleProps,
} from '../../../obniz/ObnizPartsBleAbstract';
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { MESH } from '../utils/abstracts/MESH';
import { MESH_MD } from '../MESH_js';
import { textSpanIntersectsWith } from 'typescript';

export interface MESH_100MDOptions {}

/**
 * advertisement data from MESH_100MD
 */
export interface MESH_100MD_Data {
  /** battery (0 ~ 10) */
  battery: number;
}

/** MESH_100MD management class */
export default class MESH_100MD extends MESH<MESH_100MD_Data> {
  public static readonly PartsName = 'MESH_100MD';
  public static readonly _LocalName = 'MESH-100MD';
  public static AvailableBleMode = 'Connectable' as const;
  protected readonly staticClass = MESH_100MD;

  protected static _isMESHblock(name: string) {
    console.log('name:' + name);
    return name.indexOf(MESH_100MD._LocalName) !== -1;
  }

  protected prepareConnect() {
    this._mesh = new MESH_MD();
    super.prepareConnect();
  }

  protected _notify(data: any) {
    console.log('md data: ' + data);
    this._mesh.notify(data);
    //  this.getDataWait();
  }

  public async getDataWait() {
    this.checkConnected();
    return {
      localname: this.peripheral.localName,
      address: this.peripheral.address,
      battery: this._mesh.battery,
    };
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }

  public setMode(
    requestid: number,
    mode: number,
    time1: number,
    time2: number
  ): void {
    if (!this._writeWOCharacteristic) {
      return;
    }
    if (this._writeWOCharacteristic === null) {
      return;
    }
    this._writeWOCharacteristic.writeWait(
      (this._mesh as MESH_MD).setMode(requestid, mode, time1, time2)
    );
  }
}
