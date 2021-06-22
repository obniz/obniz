/**
 * @packageDocumentation
 * @module Parts.iBS01
 */

import {
  ObnizBleBeaconStruct,
  ObnizPartsBle,
  PartsType,
} from '../../../obniz/ObnizPartsBleInterface';
import { BaseiBS01 } from '../iBS';

export interface iBS01Options {}

export interface iBS01_Data {
  battery: number;
  button: boolean;

  /**
   * @deprecated use iBS01H library
   */
  moving: boolean;

  /**
   * @deprecated use iBS01H or iBS01G library
   */
  hall_sensor: boolean;

  /**
   * @deprecated use iBS01G library
   */
  fall: boolean;
}

/**
 * @deprecated
 * Recommend use iBS01G, iBS01H, iBS01T
 * Use only if you are using an old iBS01 series sensor
 */
export default class iBS01 extends BaseiBS01<iBS01_Data> {
  public static readonly PartsName: PartsType = 'iBS01';

  protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS01_Data> = {
    battery: BaseiBS01.Config.battery,
    button: BaseiBS01.Config.button,
    moving: BaseiBS01.Config.moving,
    hall_sensor: BaseiBS01.Config.event,
    fall: BaseiBS01.Config.fall,
    // subtype=0x03 older version has no subtype
    magic: BaseiBS01.getUniqueData(1, -1).magic,
  };

  protected readonly static = iBS01 as typeof ObnizPartsBle;
}
