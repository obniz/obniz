/**
 * @packageDocumentation
 * @module Parts.iBS03T_RH
 */

import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';

export interface iBS03T_RHOptions {}

export interface iBS03T_RH_Data {
  battery: number;
  button: boolean;
  moving: boolean;
  hall_sensor: boolean;
  temperature: number;
  humidity: number;
}

export default class iBS03T_RH extends BaseiBS<iBS03T_RH_Data> {
  public static readonly PartsName = 'iBS03T_RH';

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS03T_RH_Data> = {
    battery: BaseiBS.Config.battery,
    button: BaseiBS.Config.button,
    moving: BaseiBS.Config.moving,
    hall_sensor: BaseiBS.Config.event,
    temperature: BaseiBS.Config.temperature,
    humidity: BaseiBS.Config.humidity,
    ...BaseiBS.getUniqueData(3, 0x15),
  };

  protected readonly staticClass = iBS03T_RH;
}
