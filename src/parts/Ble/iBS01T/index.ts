/**
 * @packageDocumentation
 * @module Parts.iBS01T
 */
/* eslint rulesdir/non-ascii: 0 */

import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS01 } from '../utils/abstracts/iBS';

export interface iBS01TOptions {}

/**
 * advertisement data from iBS01T
 *
 * iBS01Tからのadvertisementデータ
 */
export interface iBS01T_Data {
  /**
   * button state ボタンの状態
   *
   * true: pressed 押された状態 / false: not pressed 押されていない状態
   */
  button: boolean;
  /** moving or not 動いているかどうか */
  moving: boolean;
  /** reed bit is true or false reedビットが真かどうか */
  reed: boolean;
  /** battery 電源電圧 (Unit 単位: 0.01 V) */
  battery: number;
  /** temperature 温度 (Unit 単位: 0.01 degC)*/
  temperature: number;
  /** humidity 相対湿度 (Unit 単位: 1% RH) */
  humidity: number;
}

/** iBS01T management class iBS01Tを管理するクラス */
export default class iBS01T extends BaseiBS01<iBS01T_Data> {
  public static readonly PartsName = 'iBS01T';

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS01T_Data> = {
    battery: BaseiBS01.Config.battery,
    button: BaseiBS01.Config.button,
    moving: BaseiBS01.Config.moving,
    reed: BaseiBS01.Config.event,
    temperature: BaseiBS01.Config.temperature,
    humidity: BaseiBS01.Config.humidity,
    ...BaseiBS01.getUniqueData(1, 0x05),
  };

  protected readonly staticClass = iBS01T;
}
