/**
 * @packageDocumentation
 * @module Parts.iBS03TP
 */
import { ObnizBleBeaconStruct } from '../../../obniz/ObnizPartsBleAbstract';
import { BaseiBS } from '../utils/abstracts/iBS';
export interface iBS03TPOptions {
}
/**
 * advertisement data from iBS03TP
 *
 * iBS03TPからのadvertisementデータ
 */
export interface iBS03TP_Data {
    /** battery 電源電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /**
     * button state ボタンの状態
     *
     * true: pressed 押された状態 / false: not pressed 押されていない状態
     */
    button: boolean;
    /** moving or not 動いているかどうか */
    moving: boolean;
    /** magnet nearby or not 近くに磁石があるかどうか */
    hall_sensor: boolean;
    /** temperature 温度 (Unit 単位: 0.01 degC)*/
    temperature: number;
    /** temperature of the probe プローブの温度 (Unit 単位: 0.01 degC)*/
    probe_temperature: number;
}
/** iBS03TP management class iBS03TPを管理するクラス */
export default class iBS03TP extends BaseiBS<iBS03TP_Data> {
    static readonly PartsName = "iBS03TP";
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<iBS03TP_Data>;
    protected readonly staticClass: typeof iBS03TP;
}
