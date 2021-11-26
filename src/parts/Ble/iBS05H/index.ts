/**
 * @packageDocumentation
 * @module Parts.iBS05H
 */
/* eslint rulesdir/non-ascii: 0 */

import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';

export interface iBS05HOptions {}

/**
 * advertisement data from iBS05H
 *
 * iBS05Hからのadvertisementデータ
 */
export interface iBS05H_Data {
  /** battery 電源電圧 (Unit 単位: 0.01 V) */
  battery: number;
  /** magnet nearby or not 近くに磁石があるかどうか */
  hall_sensor: boolean;
  /** magnet triggered count 磁石が近くにあった回数 */
  count: number;
}

/** iBS05H management class iBS05Hを管理するクラス */
export default class iBS05H extends BaseiBS<iBS05H_Data> {
  public static readonly PartsName = 'iBS05H';

  public static readonly CompanyID = [0x2c, 0x08];

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS05H_Data> = {
    battery: BaseiBS.Config.battery,
    hall_sensor: BaseiBS.Config.event,
    count: BaseiBS.Config.count,
    ...BaseiBS.getUniqueData(5, 0x31),
  };

  protected readonly staticClass = iBS05H;
}
