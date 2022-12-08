/**
 * @packageDocumentation
 * @module Parts.iBS02PIR
 */
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';
export interface iBS02PIROptions {
}
/**
 * advertisement data from iBS02PIR
 *
 * iBS02PIRからのadvertisementデータ
 */
export interface iBS02PIR_Data {
    /** battery 電源電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /**
     * PIR (human detection) sensor responded or not
     *
     * PIR(人感)センサが反応したかどうか
     */
    event: boolean;
}
/** iBS02PIR management class iBS02PIRを管理するクラス */
export default class iBS02PIR extends BaseiBS<iBS02PIR_Data> {
    static readonly PartsName = "iBS02PIR";
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS02PIR_Data>;
    protected readonly staticClass: typeof iBS02PIR;
}
