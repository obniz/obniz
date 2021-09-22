/**
 * @packageDocumentation
 * @module Parts.iBS02PIR
 */

import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';

export interface iBS02PIROptions {}

export interface iBS02PIR_Data {
  battery: number;
  event: boolean;
}

export default class iBS02PIR extends BaseiBS<iBS02PIR_Data> {
  public static readonly PartsName = 'iBS02PIR';

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS02PIR_Data> = {
    battery: BaseiBS.Config.battery,
    event: BaseiBS.Config.event,
    ...BaseiBS.getUniqueData(2, 0x01),
  };

  protected readonly staticClass = iBS02PIR;
}
