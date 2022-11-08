/**
 * @packageDocumentation
 * @module Parts.PLS_01BT
 */
import Obniz from '../../../obniz';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
/**
 * data from PLS_01BT
 *
 * PLS_01BTからのデータ
 */
export interface PLS_01BTResult {
    /**
     * pulse rate 脈拍数
     *
     * Range 範囲: 25~250 (Unit 単位: 1 bpm)
     */
    pulseRate: number;
    /**
     * blood oxygen level 血中酸素濃度
     *
     * Range 範囲: 35~100 (Unit 単位 1 %)
     */
    bloodOxygenLevel: number;
    /**
     * perfusion index 灌流指数
     *
     * Range 範囲: 0~200
     */
    perfusionIndex: number;
}
export interface PLS_01BTOptions {
}
/** PLS_01BT management class PLS_01BTを管理するクラス */
export default class PLS_01BT implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    /**
     * Verify that the received peripheral is from the PLS_01BT
     *
     * 受け取ったPeripheralがPLS_01BTのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the PLS_01BT
     *
     * PLS_01BTかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    keys: string[];
    requiredKeys: string[];
    params: any;
    /**
     * Callback when receiving the measured data
     *
     * 計測結果を受け取ったときにコールバック
     */
    onmeasured: ((result: PLS_01BTResult) => void) | null;
    ondisconnect?: (reason: any) => void;
    private _uuids;
    private _peripheral;
    private _rxCharacteristic;
    private _txCharacteristic;
    constructor(peripheral: BleRemotePeripheral | null);
    wired(obniz: Obniz): void;
    /**
     * Connect the sensor
     *
     * センサへ接続
     */
    connectWait(): Promise<void>;
    /**
     * Disconnect from the sensor
     *
     * センサから切断
     */
    disconnectWait(): Promise<void>;
}
