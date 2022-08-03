/**
 * @packageDocumentation
 * @module Parts.MESH_100LE
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { LED } from '../MESH_js/block/LED';

export interface MESH_100LEOptions {}

export interface MESH_100LE_Data {
  name: string;
  address: string;
}

/** MESH_100TH management class */
export default class MESH_100LE extends MESH<MESH_100LE_Data> {
  public static readonly PartsName = 'MESH_100LE';
  public static readonly PREFIX = 'MESH-100LE';

  public static Pattern = LED.PATTERN;
  public colors: LED['colors'] = { red: 0, green: 0, blue: 0 };

  protected readonly staticClass = MESH_100LE;

  public async getDataWait() {
    this.checkConnected();
    return {
      name: this.peripheral.localName!,
      address: this.peripheral.address,
    };
  }

  /**
   * setLed
   *
   * @param colors red 0 ~ 127, green 0 ~ 127, blue 0 ~ 127
   * @param totalTime 0 ~ 65,535 [ms]
   * @param cycleOnTime 0 ~ 65,535 [ms]
   * @param cycleOffTime 0 ~ 65,535 [ms]
   * @param pattern Pattern.BLINK or Pattern.FIREFLY
   * @returns
   */
  public setLed(
    colors: MESH_100LE['colors'],
    totalTime: number,
    cycleOnTime: number,
    cycleOffTime: number,
    pattern: number
  ): void {
    const ledBlock = this.meshBlock as LED;
    const command = ledBlock.parseLedCommand(
      colors,
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
    this.meshBlock = new LED();
    super.prepareConnect();
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }
}
