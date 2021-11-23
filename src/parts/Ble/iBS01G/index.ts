/**
 * @packageDocumentation
 * @module Parts.iBS01G
 */
/* eslint rulesdir/non-ascii: 0 */

import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS01 } from '../utils/abstracts/iBS';

export interface iBS01GOptions {}

/**
 * advertisement data from iBS01G
 *
 * iBS01Gからのadvertisementデータ
 */
export interface iBS01G_Data {
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

/** iBS01G management class iBS01Gを管理するクラス */
export default class iBS01G extends BaseiBS01<iBS01G_Data> {
  public static readonly PartsName = 'iBS01G';

  public static readonly BeaconDataLength = 0x19;

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS01G_Data> = {
    battery: BaseiBS01.Config.battery,
    button: BaseiBS01.Config.button,
    moving: BaseiBS01.Config.moving,
    fall: BaseiBS01.Config.fall,
    ...BaseiBS01.getUniqueData(1, 0x06),
  };

  protected readonly staticClass = iBS01G;
}
