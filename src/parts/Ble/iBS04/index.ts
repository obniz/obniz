/**
 * @packageDocumentation
 * @module Parts.iBS04
 */

import {
  ObnizBleBeaconStruct,
  ObnizPartsBle,
  PartsType,
} from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS } from '../iBS';

export interface IBS04Options {}

export interface IBS04_Data {
  battery: number;
  button: boolean;
}

export default class IBS04 extends BaseIBS<IBS04_Data> {
  public static readonly PartsName: PartsType = 'iBS04';

  protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS04_Data> = {
    battery: BaseIBS.Config.battery,
    button: BaseIBS.Config.button,
    ...BaseIBS.getUniqueData(4, 0x19),
  };

  protected static = IBS04 as typeof ObnizPartsBle;
}
