/**
 * @packageDocumentation
 * @module Parts.iBS02IR
 */

import {
  ObnizBleBeaconStruct,
  ObnizPartsBle,
  PartsType,
} from '../../../obniz/ObnizPartsBleInterface';
import { BaseiBS } from '../iBS';

export interface iBS02IROptions {}

export interface iBS02IR_Data {
  battery: number;
  event: boolean;
}

export default class iBS02IR extends BaseiBS<iBS02IR_Data> {
  public static readonly PartsName: PartsType = 'iBS02IR';

  protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS02IR_Data> = {
    battery: BaseiBS.Config.battery,
    event: BaseiBS.Config.event,
    ...BaseiBS.getUniqueData(2, 0x02),
  };

  protected readonly static = iBS02IR as typeof ObnizPartsBle;
}
