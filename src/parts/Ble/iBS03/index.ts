/**
 * @packageDocumentation
 * @module Parts.iBS03
 */

import {
  ObnizBleBeaconStruct,
  ObnizPartsBle,
  PartsType,
} from '../../../obniz/ObnizPartsBleInterface';
import { BaseiBS } from '../iBS';

export interface iBS03Options {}

export interface iBS03_Data {
  battery: number;
  button: boolean;
  moving: boolean;
  hall_sensor: boolean;
}

export default class iBS03 extends BaseiBS<iBS03_Data> {
  public static readonly PartsName: PartsType = 'iBS03';

  protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS03_Data> = {
    battery: BaseiBS.Config.battery,
    button: BaseiBS.Config.button,
    moving: BaseiBS.Config.moving,
    hall_sensor: BaseiBS.Config.event,
    ...BaseiBS.getUniqueData(3, 0x10),
  };

  protected readonly static = iBS03 as typeof ObnizPartsBle;
}
