/**
 * @packageDocumentation
 * @module Parts.iBS03TP
 */

import {
  ObnizBleBeaconStruct,
  ObnizPartsBle,
  PartsType,
} from '../../../obniz/ObnizPartsBleInterface';
import { BaseiBS } from '../iBS';

export interface iBS03TPOptions {}

export interface iBS03TP_Data {
  battery: number;
  button: boolean;
  moving: boolean;
  hall_sensor: boolean;
  temperature: number;
  probe_temperature: number;
}

export default class iBS03TP extends BaseiBS<iBS03TP_Data> {
  public static readonly PartsName: PartsType = 'iBS03TP';

  protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS03TP_Data> = {
    battery: BaseiBS.Config.battery,
    button: BaseiBS.Config.button,
    moving: BaseiBS.Config.moving,
    hall_sensor: BaseiBS.Config.event,
    temperature: BaseiBS.Config.temperature,
    probe_temperature: {
      ...BaseiBS.Config.temperature,
      index: 7,
    },
    ...BaseiBS.getUniqueData(3, 0x17),
  };

  protected readonly static = iBS03TP as typeof ObnizPartsBle;
}
