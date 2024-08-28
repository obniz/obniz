/**
 * @packageDocumentation
 * @module Parts.iBS02IR
 */
/* eslint rulesdir/non-ascii: 0 */

import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';
import { iBS02IR_Data } from './base';

/** iBS02IR management class iBS02IRを管理するクラス */
export default class iBS02IR_Ingics extends BaseiBS<iBS02IR_Data> {
  public static readonly PartsName = 'iBS02IR_Ingics';

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS02IR_Data> = {
    battery: BaseiBS.Config.battery,
    event: BaseiBS.Config.proximity,
    ...BaseiBS.getUniqueData(3, 0x02),
  };

  protected readonly staticClass = iBS02IR_Ingics;
}
