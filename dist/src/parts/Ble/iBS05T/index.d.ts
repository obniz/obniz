/**
 * @packageDocumentation
 * @module Parts.iBS05T
 */
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';
export interface iBS05TOptions {
}
/**
 * advertisement data from iBS05T
 *
 * iBS05Tからのadvertisementデータ
 */
export interface iBS05T_Data {
    /** battery 電源電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /**
     * button state ボタンの状態
     *
     * true: pressed 押された状態 / false: not pressed 押されていない状態
     */
    button: boolean;
    /** temperature 温度 (Unit 単位: 0.01 degC)*/
    temperature: number;
}
/** iBS05T management class iBS05Tを管理するクラス */
export default class iBS05T extends BaseiBS<iBS05T_Data> {
    static readonly PartsName = "iBS05T";
    static readonly CompanyID: number[];
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS05T_Data>;
    protected readonly staticClass: typeof iBS05T;
}
