/**
 * @packageDocumentation
 * @module Parts.iBS01H
 */
/* eslint rulesdir/non-ascii: 0 */

import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS01 } from '../utils/abstracts/iBS';

export interface iBS01HOptions {}

/**
 * advertisement data from iBS01H
 *
 * iBS01Hからのadvertisementデータ
 */
export interface iBS01H_Data {
  /** battery 電池電圧 (Unit 単位: 0.01 V) */
  battery: number;
  /**
   * button state ボタンの状態
   *
   * true: pressed 押された状態 / false: not pressed 押されていない状態
   */
  button: boolean;
  /** magnet nearby or not 近くに磁石があるかどうか */
  hall_sensor: boolean;
}

/** iBS01H management class iBS01Hを管理するクラス */
export default class iBS01H extends BaseiBS01<iBS01H_Data> {
  public static readonly PartsName = 'iBS01H';

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS01H_Data> = {
    battery: BaseiBS01.Config.battery,
    button: BaseiBS01.Config.button,
    hall_sensor: BaseiBS01.Config.event,
    ...BaseiBS01.getUniqueData(1, 0x04),
  };

  protected readonly staticClass = iBS01H;
}
