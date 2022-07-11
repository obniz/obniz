/**
 * @packageDocumentation
 * @module Parts.MESH_100LE
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { MESH_js_LE } from '../MESH_js/MESH_js_LE';

export interface MESH_100LEOptions {}

export interface MESH_100LE_Data {
  /** battery (0 ~ 10) */
  battery: number;
}

/** MESH_100TH management class */
export default class MESH_100LE extends MESH<MESH_100LE_Data> {
  public static readonly PartsName = 'MESH_100LE';
  public static readonly _LocalName = 'MESH-100LE';

  protected readonly staticClass = MESH_100LE;

  public async getDataWait() {
    this.checkConnected();
    return {
      localname: this.peripheral.localName,
      address: this.peripheral.address,
      battery: this._mesh.battery,
    };
  }

  /**
   * light up
   *
   * @param red 0 ~ 127
   * @param green 0 ~ 127
   * @param blue 0 ~ 127
   * @param time 0 ~ 65535
   * @param cycle_on 0 ~ 65535
   * @param cycle_off 0 ~ 65535
   * @param pattern 1 or 2
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
    const _le = this._mesh as MESH_js_LE;
    this.writeWOResponse(
      _le.parseLightupCommand(
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

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH_100LE._LocalName) !== -1;
  }

  protected prepareConnect(): void {
    this._mesh = new MESH_js_LE();
    super.prepareConnect();
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }
}
