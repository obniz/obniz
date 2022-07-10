/**
 * @packageDocumentation
 * @module Parts.MM_BLEBC5
 */
import { Triaxial } from '../../../obniz/ObnizParts';
import { ObnizPartsBleCompare, ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import MINEW from '../utils/abstracts/MINEW';
export interface MM_BLEBC5_Options {
}
/**
 * MM_BLEBC5(ACC) data MM_BLEBC5(ACC)のデータ
 */
export interface MM_BLEBC5_Data {
    /**
     * Acceleration 加速度 (-2G~2G)
     */
    acceleration: Triaxial;
    /**
     * Battery level (0~100%)
     * バッテリー残量 (0~100%)
     */
    battery: number;
}
/**
 * ACC Slot Only
 */
export default class MM_BLEBC5 extends MINEW<MM_BLEBC5_Data> {
    protected staticClass: typeof MM_BLEBC5;
    static readonly PartsName = "MM_BLEBC5";
    static readonly ServiceDataLength = 18;
    static readonly ServiceDataStruct: ObnizPartsBleCompare<ObnizBleBeaconStruct<MM_BLEBC5_Data>>;
}
