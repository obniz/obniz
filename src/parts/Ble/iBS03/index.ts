/**
 * @packageDocumentation
 * @module Parts.iBS03
 */

import {
  ObnizBleBeaconStruct,
  ObnizPartsBle,
  PartsType,
} from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS } from '../iBS';

export interface IBS03Options {}

export interface IBS03_Data {
  battery: number;
  button: boolean;
  moving: boolean;
  hall_sensor: boolean;
}

export default class IBS03 extends BaseIBS<IBS03_Data> {
  public static readonly PartsName: PartsType = 'iBS03';

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS03_Data> = {
    battery: BaseIBS.Config.battery,
    button: BaseIBS.Config.button,
    moving: BaseIBS.Config.moving,
    hall_sensor: BaseIBS.Config.event,
    ...BaseIBS.getUniqueData(3, 0x10),
  };

  protected static = IBS03 as typeof ObnizPartsBle;
}
