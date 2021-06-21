/**
 * @packageDocumentation
 * @module Parts.iBS02PIR
 */

import {
  ObnizBleBeaconStruct,
  ObnizPartsBle,
  PartsType,
} from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS } from '../iBS';

export interface IBS02PIROptions {}

export interface IBS02PIR_Data {
  battery: number;
  event: boolean;
}

export default class IBS02PIR extends BaseIBS<IBS02PIR_Data> {
  public static readonly PartsName: PartsType = 'iBS02PIR';

  protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS02PIR_Data> = {
    battery: BaseIBS.Config.battery,
    event: BaseIBS.Config.event,
    ...BaseIBS.getUniqueData(2, 0x01),
  };

  protected static = IBS02PIR as typeof ObnizPartsBle;
}
