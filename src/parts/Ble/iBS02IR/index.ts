/**
 * @packageDocumentation
 * @module Parts.iBS02IR
 */

import {
  ObnizBleBeaconStruct,
  ObnizPartsBle,
  PartsType,
} from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS } from '../iBS';

export interface IBS02IROptions {}

export interface IBS02IR_Data {
  battery: number;
  event: boolean;
}

export default class IBS02IR extends BaseIBS<IBS02IR_Data> {
  public static readonly PartsName: PartsType = 'iBS02IR';

  protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS02IR_Data> = {
    battery: BaseIBS.Config.battery,
    event: BaseIBS.Config.event,
    ...BaseIBS.getUniqueData(2, 0x02),
  };

  protected static = IBS02IR as typeof ObnizPartsBle;
}
