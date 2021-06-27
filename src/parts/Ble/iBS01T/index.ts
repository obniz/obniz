/**
 * @packageDocumentation
 * @module Parts.iBS01T
 */

import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS01 } from '../iBS';

export interface iBS01TOptions {}

export interface iBS01T_Data {
  button: boolean;
  moving: boolean;
  reed: boolean;
  battery: number;
  temperature: number;
  humidity: number;
}

export default class iBS01T extends BaseiBS01<iBS01T_Data> {
  public static readonly PartsName = 'iBS01T';

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS01T_Data> = {
    battery: BaseiBS01.Config.battery,
    button: BaseiBS01.Config.button,
    moving: BaseiBS01.Config.moving,
    reed: BaseiBS01.Config.event,
    temperature: BaseiBS01.Config.temperature,
    humidity: BaseiBS01.Config.humidity,
    ...BaseiBS01.getUniqueData(1, 0x05),
  };

  protected readonly staticClass = iBS01T;
}
