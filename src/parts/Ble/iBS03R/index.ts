/**
 * @packageDocumentation
 * @module Parts.iBS03R
 */
/* eslint rulesdir/non-ascii: 0 */

import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import BaseiBS from '../utils/abstracts/iBS';

export interface iBS03ROptions {}

/**
 * advertisement data from iBS03R
 *
 * iBS03Rからのadvertisementデータ
 */
export interface iBS03R_Data {
  /** battery 電池電圧 (Unit 単位: 0.01 V) */
  battery: number;
  /**
   * button state ボタンの状態
   *
   * true: pressed 押された状態 / false: not pressed 押されていない状態
   */
  button: boolean;
  /** distance 距離 (Unit 単位: 1 mm) */
  distance: number;
  /** MAC address MACアドレス */
  address: string; // TODO: delete
}

/** iBS03R management class iBS03Rを管理するクラス */
export default class iBS03R extends BaseiBS<iBS03R_Data> {
  public static readonly PartsName = 'iBS03R';

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS03R_Data> = {
    battery: BaseiBS.Config.battery,
    // TODO: delete
    button: BaseiBS.Config.button,
    distance: {
      index: 7,
      length: 2,
      type: 'unsignedNumLE',
    },
    // TODO: delete
    address: {
      index: 0,
      type: 'custom',
      func: (data, peripheral) => peripheral.address,
    },
    ...BaseiBS.getUniqueData(3, 0x13),
  };

  protected readonly staticClass = iBS03R;
}
