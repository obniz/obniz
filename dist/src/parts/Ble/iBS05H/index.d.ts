/**
 * @packageDocumentation
 * @module Parts.iBS05H
 */
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';
export interface iBS05HOptions {
}
/**
 * advertisement data from iBS05H
 *
 * iBS05Hからのadvertisementデータ
 */
export interface iBS05H_Data {
    /** battery 電源電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /** magnet nearby or not 近くに磁石があるかどうか */
    hall_sensor: boolean;
    /** magnet triggered count 磁石が近くにあった回数 */
    count: number;
}
/** iBS05H management class iBS05Hを管理するクラス */
export default class iBS05H extends BaseiBS<iBS05H_Data> {
    static readonly PartsName = "iBS05H";
    static readonly CompanyID: number[];
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS05H_Data>;
    protected readonly staticClass: typeof iBS05H;
}
