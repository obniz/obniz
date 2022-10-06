/**
 * @packageDocumentation
 * @module Parts.RS_BTIREX2
 */
import Obniz from '../../../obniz';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface RS_BTIREX2Options {
}
/** 【NOT WORKING】 RS_BTIREX2 management class RS_BTIREX2を管理するクラス */
export default class RS_BTIREX2 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    /**
     * Verify that the received peripheral is from the RS_BTIREX2
     *
     * 受け取ったPeripheralがRS_BTIREX2のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the RS_BTIREX2
     *
     * RS_BTIREX2かどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    keys: string[];
    requiredKeys: string[];
    params: any;
    /**
     * Callback when the button is pressed
     *
     * ボタンが押されたときにコールバック
     */
    onbuttonpressed: ((pressed: boolean) => void) | null;
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
     * Make and send a command
     *
     * コマンドの作成と送信
     *
     * @param payload payload ペイロード
     *
     * @param crc CRC of the payload ペイロードのCRC
     *
     * @returns
     */
    _sendAndReceiveWait(payload: number[], crc?: number): Promise<number[]>;
}
