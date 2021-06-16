/**
 * @packageDocumentation
 * @module Parts.iBS01T
 */

import {
  ObnizBleBeaconStruct,
  ObnizPartsBle,
  PartsType,
} from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS01 } from '../iBS';

export interface IBS01TOptions {}

export interface IBS01T_Data {
  button: boolean;
  moving: boolean;
  reed: boolean;
  battery: number;
  temperature: number;
  humidity: number;
}

export default class IBS01T extends BaseIBS01<IBS01T_Data> {
  public static readonly PartsName: PartsType = 'iBS01T';

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS01T_Data> = {
    battery: BaseIBS01.Config.battery,
    button: BaseIBS01.Config.button,
    moving: BaseIBS01.Config.moving,
    reed: BaseIBS01.Config.event,
    temperature: BaseIBS01.Config.temperature,
    humidity: BaseIBS01.Config.humidity,
    ...BaseIBS01.getUniqueData(1, 0x05),
  };

  protected static = IBS01T as typeof ObnizPartsBle;
}
