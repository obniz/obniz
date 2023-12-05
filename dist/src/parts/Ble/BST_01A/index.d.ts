/**
 * @packageDocumentation
 * @module Parts.BST_01A
 */
import Obniz from '../../../obniz';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface } from '../../../obniz/ObnizPartsBleInterface';
/**
 * advertisement data from BST_01A
 *
 * BST_01Aからのadvertisementデータ
 */
export interface BST_01A_InfoData {
    /**
     * 機種ID
     */
    id?: string;
    /**
     * 電池電圧(v)
     */
    battery?: number;
    /**
     * 温度
     */
    temperature?: number | 'error';
    /**
     * 湿度
     */
    humidity?: number | 'error';
}
export interface BST_01AOptions {
}
/** BST_01A management class BST_01Aを管理するクラス */
export default class BST_01A implements ObnizPartsBleInterface {
    static info(): {
        name: string;
    };
    /**
     * Verify that the received peripheral is from the BST_01A
     *
     * 受け取ったPeripheralがBST_01Aのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns true when peripheral is BST_01A
     *
     * BST_01Aかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the BST_01A
     *
     * BST_01Aからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the BST_01A
     *
     * BST_01Aから受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): null | BST_01A_InfoData;
    _peripheral: null | BleRemotePeripheral;
    keys: string[];
    requiredKeys: string[];
    params: any;
    wired(obniz: Obniz): void;
}
