/**
 * @packageDocumentation
 * @module Parts.iBS01G
 */

import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS01 } from '../utils/abstracts/iBS';

export interface iBS01GOptions {}

export interface iBS01G_Data {
  battery: number;
  button: boolean;
  moving: boolean;
  fall: boolean;
}

export default class iBS01G extends BaseiBS01<iBS01G_Data> {
  public static readonly PartsName = 'iBS01G';

  public static readonly BeaconDataLength = 0x19;

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS01G_Data> = {
    battery: BaseiBS01.Config.battery,
    button: BaseiBS01.Config.button,
    moving: BaseiBS01.Config.moving,
    fall: BaseiBS01.Config.fall,
    ...BaseiBS01.getUniqueData(1, 0x06),
  };

  protected readonly staticClass = iBS01G;
}
