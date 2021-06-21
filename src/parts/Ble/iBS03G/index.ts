/**
 * @packageDocumentation
 * @module Parts.iBS03G
 */

import {
  ObnizBleBeaconStruct,
  ObnizPartsBle,
  PartsType,
} from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS } from '../iBS';

export interface IBS03GOptions {}

export interface IBS03G_Data {
  battery: number;
  button: boolean;
  moving: boolean;
  fall: boolean;
}

export default class IBS03G extends BaseIBS<IBS03G_Data> {
  public static readonly PartsName: PartsType = 'iBS03G';

  protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS03G_Data> = {
    battery: BaseIBS.Config.battery,
    button: BaseIBS.Config.button,
    moving: BaseIBS.Config.moving,
    fall: BaseIBS.Config.fall,
    ...BaseIBS.getUniqueData(3, 0x16),
  };

  protected static = IBS03G as typeof ObnizPartsBle;
}
