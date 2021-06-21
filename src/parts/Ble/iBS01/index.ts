/**
 * @packageDocumentation
 * @module Parts.iBS01
 */

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizBleBeaconStruct,
  ObnizPartsBle,
  PartsType,
} from '../../../obniz/ObnizPartsBleInterface';
import { BaseIBS01 } from '../iBS';

export interface IBS01Options {}

export interface IBS01_Data {
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
export default class IBS01 extends BaseIBS01<IBS01_Data> {
  public static readonly PartsName: PartsType = 'iBS01';

  protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS01_Data> = {
    battery: BaseIBS01.Config.battery,
    button: BaseIBS01.Config.button,
    moving: BaseIBS01.Config.moving,
    hall_sensor: BaseIBS01.Config.event,
    fall: BaseIBS01.Config.fall,
    // subtype=0x03 older version has no subtype
    magic: BaseIBS01.getUniqueData(1, -1).magic,
  };

  protected static = IBS01 as typeof ObnizPartsBle;
}
