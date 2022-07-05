/**
 * @packageDocumentation
 * @module Parts.MESH_100TH
 */
/* eslint rulesdir/non-ascii: 0 */

import { ObnizPartsBleMode } from '../../../obniz/ObnizPartsBleAbstract';
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { MESH } from '../utils/abstracts/MESH';
import { MESH_TH } from '../MESH_js';

export interface MESH_100THOptions {}

/**
 * advertisement data from MESH_100TH
 *
 * MESH_100THからのadvertisementデータ
 */
export interface MESH_100TH_Data {
  /** battery 電源電圧 (Unit 単位: 0.01 V) */
  battery: number;
  /** temperature 温度 (Unit 単位: 0.01 degC)*/
  temperature: number;
  /** humidity 相対湿度 (Unit 単位: 1% RH) */
  humidity: number;
}

/** MESH_100TH management class */
export default class MESH_100TH extends MESH<MESH_100TH_Data> {
  public static readonly PartsName = 'MESH_100TH';
  public static readonly _LocalName = 'MESH-100TH';
  public static AvailableBleMode = 'Connectable' as const;
  protected readonly staticClass = MESH_100TH;

  protected static _isMESHblock(name: string) {
    return name.indexOf(MESH_100TH._LocalName) !== -1;
  }

  protected prepareConnect() {
    this._mesh = new MESH_TH();
    super.prepareConnect();
  }

  protected _notify(data: any) {
    console.log('th data: ' + data);
    this._mesh.notify(data);
  }

  public async getDataWait() {
    this.checkConnected();
    return {
      battery: 0,
      temperature: 0,
      humidity: 0,
    };
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }

  public setMode(
    temperature_upper: number,
    temperature_bottom: number,
    temperature_condition: number,
    humidity_upper: number,
    humidity_bottom: number,
    humidity_condision: number,
    type: number
  ) {
    if (!this._writeWOCharacteristic) {
      return;
    }
    if (this._writeWOCharacteristic === null) {
      return;
    }
    this._writeWOCharacteristic.writeWait(
      (this._mesh as MESH_TH).setMode(
        temperature_upper,
        temperature_bottom,
        humidity_upper,
        humidity_bottom,
        temperature_condition,
        humidity_condision,
        type
      )
    );
  }
}
