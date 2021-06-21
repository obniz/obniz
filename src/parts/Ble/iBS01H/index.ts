/**
 * @packageDocumentation
 * @module Parts.iBS01H
 */

import {
  ObnizBleBeaconStruct,
  ObnizPartsBle,
  PartsType,
} from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS01 } from '../iBS';

export interface IBS01HOptions {}

export interface IBS01H_Data {
  battery: number;
  button: boolean;
  hall_sensor: boolean;
}

export default class IBS01H extends BaseIBS01<IBS01H_Data> {
  public static readonly PartsName: PartsType = 'iBS01H';

  protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS01H_Data> = {
    battery: BaseIBS01.Config.battery,
    button: BaseIBS01.Config.button,
    hall_sensor: BaseIBS01.Config.event,
    ...BaseIBS01.getUniqueData(1, 0x04),
  };

  protected static = IBS01H as typeof ObnizPartsBle;
}
