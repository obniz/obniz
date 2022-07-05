/**
 * @packageDocumentation
 * @module Parts.MESH_100LE
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { MESH_LE } from '../MESH_js';

export interface MESH_100LEOptions {}

export interface MESH_100LE_Data {
  /** battery (0 ~ 10) */
  battery: number;
}

/** MESH_100TH management class */
export default class MESH_100LE extends MESH<MESH_100LE_Data> {
  public static readonly PartsName = 'MESH_100LE';
  public static readonly _LocalName = 'MESH-100LE';
  public static AvailableBleMode = 'Connectable' as const;
  protected readonly staticClass = MESH_100LE;

  protected static _isMESHblock(name: string) {
    return name.indexOf(MESH_100LE._LocalName) !== -1;
  }

  protected prepareConnect() {
    this._mesh = new MESH_LE();
    super.prepareConnect();
  }

  public async getDataWait() {
    this.checkConnected();
    return {
      localname: this.peripheral.localName,
      address: this.peripheral.address,
      battery: this._mesh.getBattery(),
    };
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }

  /**
   *
   * @param red
   * @param green
   * @param blue
   * @param time
   * @param cycle_on
   * @param cycle_off
   * @param pattern
   * @returns
   */
  public lightup(
    red: number,
    green: number,
    blue: number,
    time: number,
    cycle_on: number,
    cycle_off: number,
    pattern: number
  ): void {
    if (!this._writeWOCharacteristic) {
      return;
    }
    if (this._writeWOCharacteristic === null) {
      return;
    }
    this._writeWOCharacteristic.writeWait(
      (this._mesh as MESH_LE).lightup(
        red,
        green,
        blue,
        time,
        cycle_on,
        cycle_off,
        pattern
      )
    );
  }
}
