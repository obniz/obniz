/**
 * @packageDocumentation
 * @module Parts.iBS01RG
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface IBS01RGOptions {
}
/**
 * acceleration data from IBS01RG
 *
 * IBS01RGからの加速度データ
 */
export interface IBS01RG_Acceleration_Data {
    /** acceleration (X-axis) 加速度(X軸) */
    x: number;
    /** acceleration (Y-axis) 加速度(Y軸) */
    y: number;
    /** acceleration (Z-axis) 加速度(Z軸) */
    z: number;
}
/**
 * advertisement data from IBS01RG
 *
 * IBS01RGからのadvertisementデータ
 */
export interface IBS01RG_Data {
    /** battery 電源電圧 (V) */
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
    acceleration: IBS01RG_Acceleration_Data[];
}
/** iBS01RG management class iBS01RGを管理するクラス */
export default class IBS01RG implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * verify that the received peripheral is from the iBS01RG
     *
     * 受け取ったPeripheralがiBS01RGのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the iBS01RG
     *
     * iBS01RGかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the iBS01RG
     *
     * iBS01RGからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the iBS01RG iBS01RGから受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): IBS01RG_Data | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
}
