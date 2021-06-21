/**
 * @packageDocumentation
 * @module Parts.iBS03T
 */

import {
  ObnizBleBeaconStruct,
  ObnizPartsBle,
  PartsType,
} from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS } from '../iBS';

export interface IBS03TOptions {}

export interface IBS03T_Data {
  battery: number;
  button: boolean;
  moving: boolean;
  hall_sensor: boolean;
  temperature: number;
}

export default class IBS03T extends BaseIBS<IBS03T_Data> {
  public static readonly PartsName: PartsType = 'iBS03T';

  protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS03T_Data> = {
    battery: BaseIBS.Config.battery,
    button: BaseIBS.Config.button,
    moving: BaseIBS.Config.moving,
    hall_sensor: BaseIBS.Config.event,
    temperature: BaseIBS.Config.temperature,
    ...BaseIBS.getUniqueData(3, 0x15),
  };

  protected static = IBS03T as typeof ObnizPartsBle;
}
