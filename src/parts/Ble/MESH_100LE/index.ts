/**
 * @packageDocumentation
 * @module Parts.MESH_100LE
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { MeshJsLe } from '../MESH_js/MeshJsLe';

export interface MESH_100LEOptions {}

export interface MESH_100LE_Data {
  name: string;
  address: string;
  battery: number; // 0 ~ 10
}

/** MESH_100TH management class */
export default class MESH_100LE extends MESH<MESH_100LE_Data> {
  public static readonly PartsName = 'MESH_100LE';
  public static readonly PREFIX = 'MESH-100LE';

  public static Pattern = MeshJsLe.PATTERN;

  protected readonly staticClass = MESH_100LE;

  public async getDataWait() {
    this.checkConnected();
    return {
      name: this.peripheral.localName!,
      address: this.peripheral.address,
      battery: this.meshBlock.battery,
    };
  }

  /**
   * Light Up
   *
   * @param red 0 ~ 127
   * @param green 0 ~ 127
   * @param blue 0 ~ 127
   * @param totalTime 0 ~ 65535 [ms]
   * @param cycleOnTime 0 ~ 65535 [ms]
   * @param cycleOffTime 0 ~ 65535 [ms]
   * @param pattern Pattern.Blink or Pattern.Soft
   * @returns
   */
  public lightup(
    red: number,
    green: number,
    blue: number,
    totalTime: number,
    cycleOnTime: number,
    cycleOffTime: number,
    pattern: number
  ): void {
    const ledBlock = this.meshBlock as MeshJsLe;
    const command = ledBlock.parseLightupCommand(
      red,
      green,
      blue,
      totalTime,
      cycleOnTime,
      cycleOffTime,
      pattern
    );
    this.writeWOResponse(command);
  }

  protected static _isMESHblock(name: string): boolean {
    return name.indexOf(MESH_100LE.PREFIX) !== -1;
  }

  protected prepareConnect(): void {
    this.meshBlock = new MeshJsLe();
    super.prepareConnect();
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }
}
