/**
 * @packageDocumentation
 * @module Parts.RS_BTWATTCH2
 */
import Obniz from '../../../obniz';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
/**
 * settings to be set at instantiation
 *
 * インスタンス化する際に設定するオプション(任意)
 */
export interface RS_BTWATTCH2Options {
    /**
     * Set the RTC (date) automatically or not
     *
     * By default, automatically set in {@linkplain connectWait}
     *
     * RTC(日時)を自動設定するか否か
     *
     * デフォルトでは {@linkplain connectWait} 内で自動的に設定するようになっています
     */
    rtcAutoset: boolean;
}
/**
 * data from the RS_BTWATTCH2
 *
 * RS_BTWATTCH2からのデータ
 */
export interface RS_BTWATTCH2RealtimeData {
    /**
     * measured voltage 電圧の実効値
     *
     * (Unit 単位: V)
     */
    vrms: number;
    /**
     * measured current 電流の実効値
     *
     * (Unit 単位: A)
     */
    irms: number;
    /**
     * electric power 電力
     *
     * (Unit 単位: W)
     */
    wa: number;
    /** Current Power State (Relay State) 現在の電力供給の状態(リレーの状態) */
    powerState: boolean;
    /** Reported time from device デバイスからの日時情報*/
    date: Date;
}
/** RS_BTWATTCH2 management class RS_BTWATTCH2を管理するクラス */
export default class RS_BTWATTCH2 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    /**
     * Verify that the received peripheral is from the RS_BTWATTCH2
     *
     * 受け取ったPeripheralがRS_BTWATTCH2のものかどうか確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the RS_BTWATTCH2
     *
     * RS_BTWATTCH2かどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean | "" | null;
    keys: string[];
    requiredKeys: string[];
    params: any;
    _peripheral: BleRemotePeripheral;
    ondisconnect?: (reason: any) => void;
    private _txToTargetCharacteristic;
    private _rxFromTargetCharacteristic;
    private _totalSize;
    private _received;
    private _waitings;
    /**
     * Constructor.
     *
     * If you want to change the RTC auto-configuration option from the default,
     *
     * set it as an argument at this time.
     *
     * コンストラクタ
     *
     * RTC自動設定オプションをデフォルトから変更する場合は、このタイミングで引数に設定
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @param options set auto RTC or not RTC自動設定の有無
     */
    constructor(peripheral: BleRemotePeripheral, options?: RS_BTWATTCH2Options);
    wired(obniz: Obniz): void;
    /**
     * Check if device is under pairing mode(over 3 seconds button pressing)
     *
     * デバイスがペアリングモード中であることを検出する (3秒間本体のボタンを押してください)
     *
     * @returns Whether there is a device under pairing mode
     *
     * ペアリングモード中のデバイスがあるかどうか
     */
    isPairingMode(): boolean;
    /**
     * Get the pairing key under pairing mode
     *
     * ペアリングモード中にペアリングキーを取得
     *
     * @returns pairing key ペアリングキー
     */
    firstPairingWait(): Promise<string>;
    /**
     * Connect to the target device with pairing key
     *
     * ペアリングキーを用いてデバイスと接続
     *
     * @param keys pairing key ペアリングキー
     */
    connectWait(keys: string): Promise<void>;
    /**
     * Disconnect from the device
     *
     * デバイスとの接続を切断
     */
    disconnectWait(): Promise<void>;
    /**
     * @deprecated Please use {@linkplain setRTCWait}
     *
     * {@linkplain setRTCWait} の使用を推奨
     *
     * @param date
     */
    setRTC(date?: Date): Promise<void>;
    /**
     * Set device RTC (date)
     *
     * デバイスのRTC(日時)の設定
     *
     * @param date instance of Date Dateのインスタンス
     */
    setRTCWait(date?: Date): Promise<void>;
    /**
     * Set relay ON/OFF
     *
     * リレーのON/OFFを設定する
     *
     * @param isOn set relay or not
     *
     * リレーを設定するかどうか
     */
    setPowerStateWait(isOn: boolean): Promise<void>;
    /**
     * Get current relay state
     *
     * 現在のリレーの状態を取得
     *
     * @returns the relay in set or not
     *
     * リレーが設定されているかどうか
     */
    getPowerStateWait(): Promise<boolean>;
    /**
     * Get realtime measurement data(voltage[Vrms]・electric current[Irms]・electric power[Wa]) and relay state
     *
     * リアルタイム計測データ(電圧[Vrms]・電流[Irms]・電力[Wa])とリレーの状態を取得
     *
     * @returns received realtime measurement data and relay state
     *
     * 受けとったリアルタイム計測データとリレーの状態
     */
    getRealTimeDataWait(): Promise<RS_BTWATTCH2RealtimeData>;
    private _pushData;
    private _onReceived;
    private _transactionWait;
    private _createData;
    private _GetCRC8;
}
