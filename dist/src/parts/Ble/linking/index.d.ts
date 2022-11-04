/**
 * @packageDocumentation
 * @module Parts.Linking
 */
import Obniz from '../../../obniz';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import LinkingAdvertising from './modules/advertising';
import LinkingDevice from './modules/device';
export interface LinkingOptions {
}
/**
 * Argument parameters for device
 *
 * デバイスに関する引数パラメータ
 */
export interface LinkingParams {
    /** searching duration 探索時間 */
    duration?: number;
    /** device name デバイスの名前 */
    nameFilter?: string;
    /** (not used) device ID デバイスのID */
    idFilter?: string;
    /** quick mode with no searching duration 探索待ち時間のないクイックモード */
    quick?: boolean;
}
/** products supporting Linking management class Linking対応製品を管理するクラス */
export default class Linking {
    static info(): ObnizPartsInfo;
    onadvertisement: any;
    ondiscover: any;
    /** not used */
    PRIMARY_SERVICE_UUID_LIST: string[];
    private _discover_status;
    private _discover_wait;
    private _discover_timer;
    private _peripherals;
    initialized: boolean;
    keys: string[];
    requiredKeys: string[];
    peripheral: BleRemotePeripheral | null;
    obniz: Obniz;
    get LinkingAdvertising(): typeof LinkingAdvertising;
    get LinkingDevice(): typeof LinkingDevice;
    constructor(params: any);
    wired(obniz: Obniz): void;
    /**
     * Use {@linkplain initWait}
     *
     * {@linkplain initWait} を使ってください
     *
     * @deprecated
     */
    init(): Promise<void>;
    /**
     * Initialize BLE module
     *
     * BLEを初期化
     */
    initWait(): Promise<void>;
    /**
     * Use {@linkplain discoverWait}
     *
     * {@linkplain discoverWait} を使ってください
     *
     * @deprecated
     * @param p
     */
    discover(p: LinkingParams): Promise<any[]>;
    /**
     * Search for devices with specified parameters
     *
     * 指定したパラメータのデバイスを探索
     *
     * @param p Parameters for device デバイスに関するパラメータ
     *
     * @returns Array of device objects found {@linkplain LinkingDevice}
     *
     * 見つかったデバイスオブジェクトの配列 {@linkplain LinkingDevice}
     */
    discoverWait(p: LinkingParams): Promise<any[]>;
    _checkInitialized(): void;
    _discoveredDevice(peripheral: BleRemotePeripheral, name_filter: any, id_filter: any): LinkingDevice | null;
    _scanDevices(): void;
    /**
     * Finish scanning device
     *
     * デバイスのスキャンを終了
     */
    stopScan(): void;
    /**
     * Start scanning the device
     *
     * デバイスのスキャンを開始
     *
     * @param p Parameters for device デバイスに関するパラメータ
     */
    startScan(p: LinkingParams): void;
}
