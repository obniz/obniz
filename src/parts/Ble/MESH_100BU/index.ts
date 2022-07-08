/**
 * @packageDocumentation
 * @module Parts.MESH_100BU
 */
/* eslint rulesdir/non-ascii: 0 */

import { ObnizPartsBleMode } from '../../../obniz/ObnizPartsBleAbstract';
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { MESH } from '../utils/abstracts/MESH';
import { MESH_BU } from '../MESH_js';

export interface MESH_100BUOptions {}

/**
 * advertisement data from MESH_100BU
 *
 * MESH_100BUからのadvertisementデータ
 */
export interface MESH_100BU_Data {
  battery: number;
}

/** MESH_100BU management class MESH_100BUを管理するクラス */
export default class MESH_100BU extends MESH<MESH_100BU_Data> {
  public static readonly PartsName = 'MESH_100BU';
  public static readonly _LocalName = 'MESH-100BU';
  public static AvailableBleMode = 'Connectable' as const;
  protected readonly staticClass = MESH_100BU;

  // public readonly single = MESH_BU.type.single;
  // public readonly longpress = MESH_BU.type.long;
  // public readonly double = MESH_BU.type.double;

  /** event handler */
  // public onButtonPressed: ((press_type: number) => void) | null = null;
  public onSinglePressed: (() => void) | null = null;
  public onLongPressed: (() => void) | null = null;
  public onDoublePressed: (() => void) | null = null;

  protected static _isMESHblock(name: string) {
    return name.indexOf(MESH_100BU._LocalName) !== -1;
  }

  protected prepareConnect() {
    this._mesh = new MESH_BU();
    // (this._mesh as MESH_BU).onButton = (button: number) => {
    //   if (typeof this.onButtonPressed !== 'function') {
    //     return;
    //   }
    //   this.onButtonPressed(button);
    // };
    (this._mesh as MESH_BU).onSinglePressed = () => {
      if (typeof this.onSinglePressed !== 'function') {
        return;
      }
      this.onSinglePressed();
    };
    (this._mesh as MESH_BU).onLongPressed = () => {
      if (typeof this.onLongPressed !== 'function') {
        return;
      }
      this.onLongPressed();
    };
    (this._mesh as MESH_BU).onDoublePressed = () => {
      if (typeof this.onDoublePressed !== 'function') {
        return;
      }
      this.onDoublePressed();
    };
    super.prepareConnect();
  }

  protected _notify(data: any) {
    const res = this._mesh.notify(data);
    // console.log('res : ' + res);
  }

  // 接続してデータを取ってくる
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
}
