/**
 * @packageDocumentation
 * @module Parts.iBS01G
 */

import {
  ObnizBleBeaconStruct,
  ObnizPartsBle,
  PartsType,
} from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS01 } from '../iBS';

export interface IBS01GOptions {}

export interface IBS01G_Data {
  battery: number;
  button: boolean;
  moving: boolean;
  fall: boolean;
}

export default class IBS01G extends BaseIBS01<IBS01G_Data> {
  public static readonly PartsName: PartsType = 'iBS01G';

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS01G_Data> = {
    battery: BaseIBS01.Config.battery,
    button: BaseIBS01.Config.button,
    moving: BaseIBS01.Config.moving,
    fall: BaseIBS01.Config.fall,
    ...BaseIBS01.getUniqueData(1, 0x06),
  };

  protected static = IBS01G as typeof ObnizPartsBle;
}
