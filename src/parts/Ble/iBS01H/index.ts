/**
 * @packageDocumentation
 * @module Parts.iBS01H
 */

import {
  ObnizBleBeaconStruct,
  ObnizPartsBle,
  PartsType,
} from '../../../obniz/ObnizPartsBleInterface';
import { BaseiBS01 } from '../iBS';

export interface iBS01HOptions {}

export interface iBS01H_Data {
  battery: number;
  button: boolean;
  hall_sensor: boolean;
}

export default class iBS01H extends BaseiBS01<iBS01H_Data> {
  public static readonly PartsName: PartsType = 'iBS01H';

  protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS01H_Data> = {
    battery: BaseiBS01.Config.battery,
    button: BaseiBS01.Config.button,
    hall_sensor: BaseiBS01.Config.event,
    ...BaseiBS01.getUniqueData(1, 0x04),
  };

  protected readonly static = iBS01H as typeof ObnizPartsBle;
}
