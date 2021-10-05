/**
 * @packageDocumentation
 * @module Parts.iBS02PIR
 */
/* eslint rulesdir/non-ascii: 0 */

import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';

export interface iBS02PIROptions {}

/**
 * advertisement data from iBS02PIR
 *
 * iBS02PIRからのadvertisementデータ
 */
export interface iBS02PIR_Data {
  /** battery 電源電圧 (Unit 単位: 0.01 V) */
  battery: number;
  /**
   * PIR (human detection) sensor responded or not
   *
   * PIR(人感)センサが反応したかどうか
   */
  event: boolean;
}

/** iBS02PIR management class iBS02PIRを管理するクラス */
export default class iBS02PIR extends BaseiBS<iBS02PIR_Data> {
  public static readonly PartsName = 'iBS02PIR';

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS02PIR_Data> = {
    battery: BaseiBS.Config.battery,
    event: BaseiBS.Config.event,
    ...BaseiBS.getUniqueData(2, 0x01),
  };

  protected readonly staticClass = iBS02PIR;
}
