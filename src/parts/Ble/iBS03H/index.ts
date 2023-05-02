/**
 * @packageDocumentation
 * @module Parts.iBS03H
 */
/* eslint rulesdir/non-ascii: 0 */

import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS, BaseiBS01 } from '../utils/abstracts/iBS';

export interface iBS03HOptions {}

/**
 * advertisement data from iBS03H
 *
 * iBS03Hからのadvertisementデータ
 */
export interface iBS03H_Data {
  /** battery 電源電圧 (Unit 単位: 0.01 V) */
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

/** iBS03H management class iBS03Hを管理するクラス */
export default class iBS03H extends BaseiBS<iBS03H_Data> {
  public static readonly PartsName = 'iBS03H';

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS03H_Data> = {
    battery: BaseiBS.Config.battery,
    button: BaseiBS01.Config.button,
    hall_sensor: BaseiBS.Config.event,
    ...BaseiBS.getUniqueData(3, 0x10),
  };

  protected readonly staticClass = iBS03H;
}