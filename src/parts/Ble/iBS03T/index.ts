/**
 * @packageDocumentation
 * @module Parts.iBS03T
 */
/* eslint rulesdir/non-ascii: 0 */

import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';

export interface iBS03TOptions {}

/**
 * advertisement data from iBS03T
 *
 * iBS03Tからのadvertisementデータ
 */
export interface iBS03T_Data {
  /** battery 電源電圧 (Unit 単位: 0.01 V) */
  battery: number;
  /**
   * button state ボタンの状態
   *
   * true: pressed 押された状態 / false: not pressed 押されていない状態
   */
  button: boolean;
  /** moving or not 動いているかどうか */
  moving: boolean;
  /** magnet nearby or not 近くに磁石があるかどうか */
  hall_sensor: boolean;
  /** temperature 温度 (Unit 単位: 0.01 degC)*/
  temperature: number;
}

/** iBS03T management class iBS03Tを管理するクラス */
export default class iBS03T extends BaseiBS<iBS03T_Data> {
  public static readonly PartsName = 'iBS03T';

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS03T_Data> = {
    battery: BaseiBS.Config.battery,
    button: BaseiBS.Config.button,
    moving: BaseiBS.Config.moving,
    hall_sensor: BaseiBS.Config.event,
    temperature: BaseiBS.Config.temperature,
    ...BaseiBS.getUniqueData(3, 0x15),
  };

  protected readonly staticClass = iBS03T;
}
