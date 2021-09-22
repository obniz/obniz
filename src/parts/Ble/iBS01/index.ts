/**
 * @packageDocumentation
 * @module Parts.iBS01
 */

import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS01 } from '../utils/abstracts/iBS';

export interface iBS01Options {}

export interface iBS01_Data {
  battery: number;
  button: boolean;
  moving: boolean;
  hall_sensor: boolean;
  fall: boolean;
}

/**
 * @deprecated
 * Recommend use iBS01G, iBS01H
 * Use only if you are using an old iBS01 series sensor
 */
export default class iBS01 extends BaseiBS01<iBS01_Data> {
  public static readonly PartsName = 'iBS01';

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS01_Data> = {
    battery: BaseiBS01.Config.battery,
    button: BaseiBS01.Config.button,
    moving: BaseiBS01.Config.moving,
    hall_sensor: BaseiBS01.Config.event,
    fall: BaseiBS01.Config.fall,
    // subtype=0x03 older version has no subtype
    magic: BaseiBS01.getUniqueData(1, -1).magic,
  };

  protected readonly staticClass = iBS01;
}
