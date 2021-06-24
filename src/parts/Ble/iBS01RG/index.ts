/**
 * @packageDocumentation
 * @module Parts.iBS01RG
 */

import {
  ObnizBleBeaconStruct,
  ObnizPartsBle,
  PartsType,
  Triaxial,
  uint,
} from '../../../obniz/ObnizPartsBleInterface';
import { BaseiBS01 } from '../iBS';

export interface iBS01RGOptions {}

export interface iBS01RG_Data {
  battery: number;
  active: boolean;
  button: boolean;
  acceleration: Triaxial[];
}

export default class iBS01RG extends BaseiBS01<iBS01RG_Data> {
  public static readonly PartsName: PartsType = 'iBS01RG';

  protected static readonly BeaconDataLength = 0x19;

  protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS01RG_Data> = {
    battery: {
      ...BaseiBS01.Config.battery,
      type: 'custom',
      func: (data) => uint([data[0], data[1] & 0x0f]) * 0.01,
    },
    active: {
      ...BaseiBS01.Config.event,
      type: 'bool00010000',
    },
    button: {
      ...BaseiBS01.Config.button,
      type: 'bool00100000',
    },
    acceleration: BaseiBS01.Config.acceleration,
    magic: BaseiBS01.getUniqueData(1.1, -1).magic,
  };

  protected readonly static = iBS01RG as typeof ObnizPartsBle;
}
