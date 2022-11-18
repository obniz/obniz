/**
 * @packageDocumentation
 * @module Parts.Logtta
 */
import { BleRemotePeripheral } from '../../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleCompare, ObnizPartsBleConnectable, ObnizPartsBleMode } from '../../../../obniz/ObnizPartsBleAbstract';
import { BleBatteryService } from '../services/batteryService';
import { BleGenericAccess } from '../services/genericAccess';
declare type PinCodeType = 'Authentication' | 'Rewrite';
/** abstract class common to the Logtta series Logttaシリーズ共通の抽象クラス */
export default abstract class Logtta<S, T> extends ObnizPartsBleConnectable<S, T> {
    static readonly AvailableBleMode: ObnizPartsBleMode | ObnizPartsBleMode[];
    static readonly LocalName: {
        Connectable: undefined;
        Beacon: RegExp;
    };
    static readonly BeaconDataLength: ObnizPartsBleCompare<number | null>;
    static readonly CompanyID: ObnizPartsBleCompare<number[] | null>;
    protected serviceUuid: string;
    protected authenticated: boolean;
    onNotify?: (data: T) => void;
    genericAccess?: BleGenericAccess;
    batteryService?: BleBatteryService;
    constructor(peripheral: BleRemotePeripheral, mode: ObnizPartsBleMode);
    /**
     * Connect to the services of a device
     *
     * デバイスのサービスに接続
     *
     * @param keys Key acquired when pairing previously 以前にペアリングしたときに取得されたキー
     */
    connectWait(keys?: string): Promise<void>;
    protected beforeOnDisconnectWait(): Promise<void>;
    /**
     * Get data with connected state
     *
     * 接続状態でデータを取得
     *
     * @returns received value from each sensor それぞれのセンサから取得した値
     */
    getDataWait(): Promise<T>;
    /**
     * Notify when the data have got from the device with connected state
     *
     * 接続状態でデータを取得したとき通知
     *
     * @param callback callback function コールバック関数
     *
     * @returns
     */
    startNotifyWait(callback: (data: T) => void): Promise<void>;
    /**
     * Authorize PIN code
     *
     * ピンコードを認証
     *
     * @param code PIN code ピンコード
     *
     * @returns Whether authentication was/is passed 認証が通った/通っているかどうか
     */
    authPinCodeWait(code: string | number): Promise<boolean>;
    protected sendPinCodeWait(type: PinCodeType, code: number): Promise<boolean>;
    protected checkAuthenticated(): void;
    /**
     * Set / unset to Beacon Mode
     *
     * ビーコンモードに設定/解除
     *
     * @param enable enable / disable 有効 / 無効
     *
     * @returns data write result
     */
    setBeaconModeWait(enable: boolean): Promise<boolean>;
    protected getName(): string;
    protected getCharUuid(code: number): string;
    protected abstract parseData(data: number[]): T;
}
export {};
