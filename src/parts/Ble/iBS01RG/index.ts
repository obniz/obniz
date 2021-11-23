/**
 * @packageDocumentation
 * @module Parts.iBS01RG
 */
/* eslint rulesdir/non-ascii: 0 */

import { Triaxial } from '../../../obniz/ObnizParts';
import {
  ObnizBleBeaconStruct,
  uint,
} from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS01 } from '../utils/abstracts/iBS';

export interface iBS01RGOptions {}

/**
 * advertisement data from iBS01RG
 *
 * iBS01RGからのadvertisementデータ
 */
export interface iBS01RG_Data {
  /** battery 電源電圧 (Unit 単位: 0.01 V) */
  battery: number;
  /** active or inactive アクティブか非アクティブか */
  active: boolean;
  /**
   * button state ボタンの状態
   *
   * true: pressed 押された状態 / false: not pressed 押されていない状態
   */
  button: boolean;
  /** acceleration (X, Y, Z axis) 加速度 (X, Y, Z軸)*/
  acceleration: Triaxial[];
}

export default class iBS01RG extends BaseiBS01<iBS01RG_Data> {
  public static readonly PartsName = 'iBS01RG';

  public static readonly BeaconDataLength = 0x19;

  public static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS01RG_Data> = {
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

  protected readonly staticClass = iBS01RG;
}
