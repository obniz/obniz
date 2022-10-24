/**
 * @packageDocumentation
 * @module Parts.MESH_100BU
 */
/* eslint rulesdir/non-ascii: 0 */

import { MESH } from '../utils/abstracts/MESH';
import { Button } from '../utils/abstracts/MESHjs/block/Button';
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';

export interface MESH_100BUOptions {}

/**
 * advertisement data from MESH_100BU
 */
export interface MESH_100BU_Data {
  name: string;
  address: string;
}

/** MESH_100BU management class */
export default class MESH_100BU extends MESH<MESH_100BU_Data> {
  public static readonly PartsName = 'MESH_100BU';
  public static readonly LocalName = /^MESH-100BU/;

  /** Event Handler */
  public onSinglePressed: (() => void) | null = null;
  public onLongPressed: (() => void) | null = null;
  public onDoublePressed: (() => void) | null = null;

  protected readonly staticClass = MESH_100BU;

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
    return Button.isMESHblock(peripheral.localName, opt_serialnumber);
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
    this.meshBlock = new Button();

    const buttonBlock = this.meshBlock as Button;
    buttonBlock.onSinglePressed = () => {
      if (typeof this.onSinglePressed !== 'function') {
        return;
      }
      this.onSinglePressed();
    };
    buttonBlock.onLongPressed = () => {
      if (typeof this.onLongPressed !== 'function') {
        return;
      }
      this.onLongPressed();
    };
    buttonBlock.onDoublePressed = () => {
      if (typeof this.onDoublePressed !== 'function') {
        return;
      }
      this.onDoublePressed();
    };
    super.prepareConnect();
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }
}
