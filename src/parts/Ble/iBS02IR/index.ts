/**
 * @packageDocumentation
 * @module Parts.iBS02IR
 */
/* eslint rulesdir/non-ascii: 0 */

import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';

export interface iBS02IROptions {}

/**
 * advertisement data from iBS02IR
 *
 * iBS02IRからのadvertisementデータ
 */
export interface iBS02IR_Data {
  /** battery 電源電圧 (Unit 単位: 0.01 V) */
  battery: number;
  /** IR proximity sensor responded or not 赤外線近接センサが反応したかどうか */
  event: boolean;
}

/** iBS02IR management class iBS02IRを管理するクラス */
export default class iBS02IR extends BaseiBS<iBS02IR_Data> {
  public static readonly PartsName = 'iBS02IR';

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS02IR_Data> = {
    battery: BaseiBS.Config.battery,
    event: BaseiBS.Config.event,
    ...BaseiBS.getUniqueData(2, 0x02),
  };

  protected readonly staticClass = iBS02IR;
}
