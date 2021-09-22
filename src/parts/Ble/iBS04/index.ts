/**
 * @packageDocumentation
 * @module Parts.iBS04
 */

import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';

export interface iBS04Options {}

export interface iBS04_Data {
  battery: number;
  button: boolean;
}

export default class iBS04 extends BaseiBS<iBS04_Data> {
  public static readonly PartsName = 'iBS04';

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS04_Data> = {
    battery: BaseiBS.Config.battery,
    button: BaseiBS.Config.button,
    ...BaseiBS.getUniqueData(4, 0x19),
  };

  protected readonly staticClass = iBS04;
}
