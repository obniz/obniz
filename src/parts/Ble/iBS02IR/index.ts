/**
 * @packageDocumentation
 * @module Parts.iBS02IR
 */

import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../iBS';

export interface iBS02IROptions {}

export interface iBS02IR_Data {
  battery: number;
  event: boolean;
}

export default class iBS02IR extends BaseiBS<iBS02IR_Data> {
  public static readonly PartsName = 'iBS02IR';

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS02IR_Data> = {
    battery: BaseiBS.Config.battery,
    event: BaseiBS.Config.event,
    ...BaseiBS.getUniqueData(2, 0x02),
  };

  protected readonly staticClass = iBS02IR;
}
