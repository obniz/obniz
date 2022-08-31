/**
 * @packageDocumentation
 * @module Parts.MESH_100LE
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { LED } from '../utils/abstracts/MESHjs/block/LED';
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';

export interface MESH_100LEOptions {}

export interface MESH_100LE_Data {
  name: string;
  address: string;
}

/** MESH_100TH management class */
export default class MESH_100LE extends MESH<MESH_100LE_Data> {
  public static readonly PartsName = 'MESH_100LE';
  public static readonly LocalName = /^MESH-100LE/;

  public static Pattern = LED.PATTERN;
  public colors: LED['colors'] = { red: 0, green: 0, blue: 0 };

  protected readonly staticClass = MESH_100LE;

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
    return LED.isMESHblock(peripheral.localName, opt_serialnumber);
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

  /**
   * setLed
   *
   * @param colors { red: 0-127, green: 0-127, blue: 0-127 }
   * @param totalTime 0-65,535 [ms]
   * @param cycleOnTime 0-65,535 [ms]
   * @param cycleOffTime 0-65,535 [ms]
   * @param pattern Pattern.BLINK or Pattern.FIREFLY
   * @returns void
   */
  public setLed(
    colors: MESH_100LE['colors'],
    totalTime: number,
    cycleOnTime: number,
    cycleOffTime: number,
    pattern: number
  ): void {
    const ledBlock = this.meshBlock as LED;
    const command = ledBlock.createLedCommand(
      colors,
      totalTime,
      cycleOnTime,
      cycleOffTime,
      pattern
    );
    this.writeWOResponse(command);
  }

  protected prepareConnect(): void {
    this.meshBlock = new LED();
    super.prepareConnect();
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }
}
