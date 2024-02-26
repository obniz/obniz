/**
 * @packageDocumentation
 * @module Parts.iBS02M2
 */
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';
export interface iBS02M2Options {
}
/**
 * advertisement data from iBS02
 *
 * iBS02M2からのadvertisementデータ
 */
export interface iBS02M2_Data {
    /** battery 電源電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /**
     * M2Detect Input
     *
     * M2入寮の反応があった
     */
    input_trigger: boolean;
}
/** iBS02M2 management class iBS02M2を管理するクラス */
export default class iBS02M2 extends BaseiBS<iBS02M2_Data> {
    static readonly PartsName = "iBS02M2";
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS02M2_Data>;
    protected readonly staticClass: typeof iBS02M2;
}
