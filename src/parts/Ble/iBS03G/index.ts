/**
 * @packageDocumentation
 * @module Parts.iBS03G
 */

import {
  ObnizBleBeaconStruct,
  ObnizPartsBle,
  PartsType,
} from '../../../obniz/ObnizPartsBleInterface';
import { BaseiBS } from '../iBS';

export interface iBS03GOptions {}

export interface iBS03G_Data {
  battery: number;
  button: boolean;
  moving: boolean;
  fall: boolean;
}

export default class iBS03G extends BaseiBS<iBS03G_Data> {
  public static readonly PartsName: PartsType = 'iBS03G';

  protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS03G_Data> = {
    battery: BaseiBS.Config.battery,
    button: BaseiBS.Config.button,
    moving: BaseiBS.Config.moving,
    fall: BaseiBS.Config.fall,
    ...BaseiBS.getUniqueData(3, 0x16),
  };

  protected readonly static = iBS03G as typeof ObnizPartsBle;
}
