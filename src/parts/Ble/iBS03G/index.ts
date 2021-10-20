/**
 * @packageDocumentation
 * @module Parts.iBS03G
 */
/* eslint rulesdir/non-ascii: 0 */

import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';

export interface iBS03GOptions {}

/**
 * advertisement data from iBS03G
 *
 * iBS03Gからのadvertisementデータ
 */
export interface iBS03G_Data {
  /** battery 電池電圧 (Unit 単位: 0.01 V) */
  battery: number;
  /**
   * button state ボタンの状態
   *
   * true: pressed 押された状態 / false: not pressed 押されていない状態
   */
  button: boolean;
  /** moving or not 動いているかどうか */
  moving: boolean;
  /** fallen or not 落ちたかどうか */
  fall: boolean;
}

/** iBS03G management class iBS03Gを管理するクラス */
export default class iBS03G extends BaseiBS<iBS03G_Data> {
  public static readonly PartsName = 'iBS03G';

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS03G_Data> = {
    battery: BaseiBS.Config.battery,
    button: BaseiBS.Config.button,
    moving: BaseiBS.Config.moving,
    fall: BaseiBS.Config.fall,
    ...BaseiBS.getUniqueData(3, 0x16),
  };

  protected readonly staticClass = iBS03G;
}
