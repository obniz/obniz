/**
 * @packageDocumentation
 * @module Parts.iBS05T
 */
/* eslint rulesdir/non-ascii: 0 */

import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';

export interface iBS05TOptions {}

/**
 * advertisement data from iBS05T
 *
 * iBS05Tからのadvertisementデータ
 */
export interface iBS05T_Data {
  /** battery 電源電圧 (Unit 単位: 0.01 V) */
  battery: number;
  /**
   * button state ボタンの状態
   *
   * true: pressed 押された状態 / false: not pressed 押されていない状態
   */
  button: boolean;
  /** temperature 温度 (Unit 単位: 0.01 degC)*/
  temperature: number;
}

/** iBS05T management class iBS05Tを管理するクラス */
export default class iBS05T extends BaseiBS<iBS05T_Data> {
  public static readonly PartsName = 'iBS05T';

  public static readonly CompanyID = [0x2c, 0x08];

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS05T_Data> = {
    battery: BaseiBS.Config.battery,
    button: BaseiBS.Config.button,
    temperature: BaseiBS.Config.temperature,
    ...BaseiBS.getUniqueData(5, 0x32),
  };

  protected readonly staticClass = iBS05T;
}
