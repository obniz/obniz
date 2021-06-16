/**
 * @packageDocumentation
 * @module Parts.iBS03TP
 */

import {
  ObnizBleBeaconStruct,
  ObnizPartsBle,
  PartsType,
} from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS } from '../iBS';

export interface IBS03TPOptions {}

export interface IBS03TP_Data {
  battery: number;
  button: boolean;
  moving: boolean;
  hall_sensor: boolean;
  temperature: number;
  probe_temperature: number;
}

export default class IBS03TP extends BaseIBS<IBS03TP_Data> {
  public static readonly PartsName: PartsType = 'iBS03TP';

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS03TP_Data> = {
    battery: BaseIBS.Config.battery,
    button: BaseIBS.Config.button,
    moving: BaseIBS.Config.moving,
    hall_sensor: BaseIBS.Config.event,
    temperature: BaseIBS.Config.temperature,
    probe_temperature: {
      ...BaseIBS.Config.temperature,
      index: 7,
    },
    ...BaseIBS.getUniqueData(3, 0x17),
  };

  protected static = IBS03TP as typeof ObnizPartsBle;
}
