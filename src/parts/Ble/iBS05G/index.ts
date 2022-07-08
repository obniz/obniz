/**
 * @packageDocumentation
 * @module Parts.iBS05G
 */
/* eslint rulesdir/non-ascii: 0 */

import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';

export interface iBS05GOptions {}

/**
 * advertisement data from iBS05G
 *
 * iBS05Gからのadvertisementデータ
 */
export interface iBS05G_Data {
  /** battery 電源電圧 (Unit 単位: 0.01 V) */
  battery: number;
  /** moving or not 動いているかどうか */
  moving: boolean;
}

/** iBS05G management class iBS05Gを管理するクラス */
export default class iBS05G extends BaseiBS<iBS05G_Data> {
  public static readonly PartsName = 'iBS05G';

  public static readonly CompanyID = [0x2c, 0x08];

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS05G_Data> = {
    battery: BaseiBS.Config.battery,
    moving: BaseiBS.Config.moving,
    ...BaseiBS.getUniqueData(5, 0x33),
  };

  protected readonly staticClass = iBS05G;
}
