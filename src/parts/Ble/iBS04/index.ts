/**
 * @packageDocumentation
 * @module Parts.iBS04
 */
/* eslint rulesdir/non-ascii: 0 */

import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';

export interface iBS04Options {}

/**
 * advertisement data from iBS04
 *
 * iBS04からのadvertisementデータ
 */
export interface iBS04_Data {
  /** battery 電源電圧 (Unit 単位: 0.01 V) */
  battery: number;
  /**
   * button state ボタンの状態
   *
   * true: pressed 押された状態 / false: not pressed 押されていない状態
   */
  button: boolean;
}

/** iBS04 management class iBS04を管理するクラス */
export default class iBS04 extends BaseiBS<iBS04_Data> {
  public static readonly PartsName = 'iBS04';

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS04_Data> = {
    battery: BaseiBS.Config.battery,
    button: BaseiBS.Config.button,
    ...BaseiBS.getUniqueData(4, 0x19),
  };

  protected readonly staticClass = iBS04;
}
