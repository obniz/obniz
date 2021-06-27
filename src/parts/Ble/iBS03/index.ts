/**
 * @packageDocumentation
 * @module Parts.iBS03
 */

import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../iBS';

export interface iBS03Options {}

export interface iBS03_Data {
  battery: number;
  button: boolean;
  moving: boolean;
  hall_sensor: boolean;
}

export default class iBS03 extends BaseiBS<iBS03_Data> {
  public static readonly PartsName = 'iBS03';

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS03_Data> = {
    battery: BaseiBS.Config.battery,
    button: BaseiBS.Config.button,
    moving: BaseiBS.Config.moving,
    hall_sensor: BaseiBS.Config.event,
    ...BaseiBS.getUniqueData(3, 0x10),
  };

  protected readonly staticClass = iBS03;
}
