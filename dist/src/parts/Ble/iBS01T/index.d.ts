/**
 * @packageDocumentation
 * @module Parts.iBS01T
 */
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS01 } from '../utils/abstracts/iBS';
export interface iBS01TOptions {
}
/**
 * advertisement data from iBS01T
 *
 * iBS01Tからのadvertisementデータ
 */
export interface iBS01T_Data {
    /**
     * button state ボタンの状態
     *
     * true: pressed 押された状態 / false: not pressed 押されていない状態
     */
    button: boolean;
    /** moving or not 動いているかどうか */
    moving: boolean;
    /** reed bit is true or false reedビットが真かどうか */
    reed: boolean;
    /** battery 電源電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /** temperature 温度 (Unit 単位: 0.01 degC)*/
    temperature: number;
    /** humidity 相対湿度 (Unit 単位: 1% RH) */
    humidity: number;
}
/** iBS01T management class iBS01Tを管理するクラス */
export default class iBS01T extends BaseiBS01<iBS01T_Data> {
    static readonly PartsName = "iBS01T";
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS01T_Data>;
    protected readonly staticClass: typeof iBS01T;
}
