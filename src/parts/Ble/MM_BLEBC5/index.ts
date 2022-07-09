/**
 * @packageDocumentation
 * @module Parts.MM_BLEBC5
 */
/* eslint rulesdir/non-ascii: 0 */

import { Triaxial } from '../../../obniz/ObnizParts';
import {
  ObnizPartsBleCompare,
  ObnizBleBeaconStruct,
} from '../../../obniz/ObnizPartsBleAbstract';
import MINEW from '../utils/abstracts/MINEW';

export interface MM_BLEBC5_Options {}

/**
 * MM_BLEBC5(ACC) data MM_BLEBC5(ACC)のデータ
 */
export interface MM_BLEBC5_Data {
  /**
   * Acceleration 加速度 (-2G~2G)
   */
  acceleration: Triaxial;
  // TODO: delete by abstract definition
  /**
   * Battery level (0~100%)
   * バッテリー残量 (0~100%)
   */
  battery: number;
}

/**
 * AAC Slot Only
 */
export default class MM_BLEBC5 extends MINEW<MM_BLEBC5_Data> {
  protected staticClass = MM_BLEBC5;
  public static readonly PartsName = 'MM_BLEBC5';

  public static readonly ServiceDataLength = 18;

  public static readonly ServiceDataStruct: ObnizPartsBleCompare<
    ObnizBleBeaconStruct<MM_BLEBC5_Data>
  > = MINEW.getServiceDataStruct<MM_BLEBC5_Data>(9, 3, {
    // TODO: delete (abstract)
    battery: {
      index: 2,
      type: 'unsignedNumBE',
    },
    acceleration: {
      index: 3,
      length: 6,
      type: 'xyz',
      fixedIntegerBytes: 1,
      round: 2,
    },
  });
}
