/**
 * @packageDocumentation
 * @module Parts.MT_500BT
 */
import Obniz from '../../../obniz';
import { BleRemoteCharacteristic } from '../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { BleRemoteService } from '../../../obniz/libs/embeds/bleHci/bleRemoteService';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import { BleGenericAccess } from '../utils/services/genericAccess';
export interface MT_500BTOptions {
}
/** MT_500BT management class MT_500BTを管理するクラス */
export default class MT_500BT implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    /**
     * Verify that the received peripheral is from the MT_500BT
     *
     * 受け取ったPeripheralがMT_500BTのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the MT_500BT
     *
     * MT_500BTかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get IFUID from the localName
     *
     * localNameからIFUIDを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns IFUID
     */
    static getIFUID(peripheral: BleRemotePeripheral): number | null;
    /**
     * Decrypt CNKEY from IFUID
     *
     * IFUIDからCNKEYを復号
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns decrypted CNKEY 復号されたされたCNKEY
     */
    static getCNKey(peripheral: BleRemotePeripheral): number | null;
    keys: string[];
    requiredKeys: string[];
    params: any;
    ondisconnect?: (reason: any) => void;
    genericAccess?: BleGenericAccess;
    MSDPService?: BleRemoteService;
    MSDPRxChar?: BleRemoteCharacteristic;
    MSDPTxChar?: BleRemoteCharacteristic;
    private _emitter;
    private _uuids;
    private _peripheral;
    constructor(peripheral: BleRemotePeripheral);
    wired(obniz: Obniz): void;
    /**
     * Connect (and authenticate) the sensor
     *
     * センサへ接続(+ センサの認証)
     */
    connectWait(): Promise<void>;
    /**
     * Send the communication start command
     *
     * 通信開始コマンドを送信
     */
    startCommunicationCommandWait(): Promise<void>;
    /**
     * Get device information from the MT_500BT
     *
     * MT_500BTからのデバイス情報データ取得
     *
     * @returns received device information data from the MT_500BT
     *
     * MT_500BTからのデバイス情報データ
     *
     * ```
     * {
     *
     * cls: device type デバイスタイプ
     *
     * ('Pulse rate meter', 'SpO2(BO)', 'Thermometer', 'SpO2(MP)', 'Blood pressure meter'),
     *
     * dvnm: product information 製品情報,
     *
     * swif: detailed information 詳細情報
     *
     * }
     * ```
     */
    getDeviceInformationWait(): Promise<any>;
    /**
     * Get temperature and humidity data from the MT_500BT
     *
     * MT_500BTから温湿度データを取得
     *
     * @returns received temperature and humidity data from the MT_500BT
     *
     * MT_500BTからの温湿度データ
     *
     * ```
     * {
     *
     * timestamp: timestamp タイムスタンプ,
     *
     * temperature: {
     *
     *   body: body temperature 体温,
     *
     *   material: material temperature 物体温度,
     *
     *   air: air temperature 気温
     *
     *   }
     *
     * }
     * ```
     */
    getTemperatureWait(): Promise<any>;
    /**
     * Disconnect from the sensor
     *
     * センサから切断
     */
    disconnectWait(): Promise<void>;
    private _createCommand;
    private _checksum;
    private _sendDataReplyWait;
}
