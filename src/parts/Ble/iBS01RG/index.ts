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
import { BaseIBS01 } from '../iBS';

export interface IBS01RGOptions {}

export interface IBS01RG_Data {
  battery: number;
  active: boolean;
  button: boolean;
  acceleration: Triaxial[];
}

export default class IBS01RG extends BaseIBS01<IBS01RG_Data> {
  public static readonly PartsName: PartsType = 'iBS01RG';

  protected static readonly BeaconDataStruct: ObnizBleBeaconStruct<IBS01RG_Data> = {
    battery: {
      ...BaseIBS01.Config.battery,
      type: 'custom',
      func: (data) => uint([data[0], data[1] & 0x0f]) * 0.01,
    },
    active: {
      ...BaseIBS01.Config.event,
      type: 'bool00010000',
    },
    button: {
      ...BaseIBS01.Config.button,
      type: 'bool00100000',
    },
    acceleration: BaseIBS01.Config.acceleration,
    magic: BaseIBS01.getUniqueData(1.1, -1).magic,
  };

  protected static = IBS01RG as typeof ObnizPartsBle;
}
