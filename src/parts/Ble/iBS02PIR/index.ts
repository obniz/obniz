/**
 * @packageDocumentation
 * @module Parts.iBS02PIR
 */

import {
  ObnizBleBeaconStruct,
  ObnizPartsBle,
  PartsType,
} from '../../../obniz/ObnizPartsBleInterface';
import { BaseiBS } from '../iBS';

export interface iBS02PIROptions {}

export interface iBS02PIR_Data {
  battery: number;
  event: boolean;
}

export default class iBS02PIR extends BaseiBS<iBS02PIR_Data> {
  public static readonly PartsName: PartsType = 'iBS02PIR';

  protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS02PIR_Data> = {
    battery: BaseiBS.Config.battery,
    event: BaseiBS.Config.event,
    ...BaseiBS.getUniqueData(2, 0x01),
  };

  protected readonly static = iBS02PIR as typeof ObnizPartsBle;
}
