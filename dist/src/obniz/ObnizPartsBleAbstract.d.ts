/**
 * @packageDocumentation
 * @module ObnizCore
 */
import { BleRemoteCharacteristic } from './libs/embeds/bleHci/bleRemoteCharacteristic';
import { BleConnectSetting, BleRemotePeripheral, IBeacon } from './libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsInfo, ObnizPartsProps } from './ObnizPartsInterface';
import { PartsType } from './ObnizPartsList';
declare const ObnizPartsBleModeList: readonly ["Beacon", "Connectable", "Pairing"];
export declare type ObnizPartsBleMode = typeof ObnizPartsBleModeList[number];
declare type ObnizPartsBleCompareByMode<S> = {
    [key in ObnizPartsBleMode]?: S;
};
export declare type ObnizPartsBleCompareWithNonNull<S> = ObnizPartsBleCompareByMode<S> | S;
export declare type ObnizPartsBleCompare<S> = ObnizPartsBleCompareByMode<S | null> | S;
declare type NumberType = 'numLE' | 'numBE' | 'unsignedNumLE' | 'unsignedNumBE';
declare type BoolType = 'bool0001' | 'bool0010' | 'bool0100' | 'bool1000' | 'bool00010000' | 'bool00100000' | 'bool01000000' | 'bool10000000';
declare type OtherType = 'string' | 'xyz';
declare type CustomType = 'custom';
declare type CheckType = 'check';
export declare type NormalValueType = NumberType | BoolType | OtherType;
export declare type ObnizBleBeaconStruct<S> = {
    [key in keyof S]: ObnizBleBeaconStructNormal<S, key>;
} | {
    [key in Exclude<string, keyof S>]: ObnizBleBeaconStructCheck;
};
declare type ObnizBleBeaconStructStrict<S, T extends string> = {
    [key in keyof S | T]: key extends keyof S ? ObnizBleBeaconStructNormal<S, key> : ObnizBleBeaconStructCheck;
};
interface ObnizBleBeaconStructStandard<S> {
    /** Value type */
    type: S;
    /** Start position (ex: 5.625 -> 46bit\~) */
    index: number;
    /** Default: 1byte = 8bit (ex: 1.875 -> 15bit) */
    length?: number;
    /** Be sure to use scan response data */
    scanResponse?: boolean;
}
export declare type ObnizBleBeaconStructNormal<S, key extends keyof S> = (ObnizBleBeaconStructStandard<NormalValueType> & {
    /** Default: 0 (def: base + parseInt() * multiple) */
    base?: number;
    /** Default: 1 (def: base + parseInt() * multiple) */
    multiple?: number;
    /** Default: none (ex: 0.1234 --(round: 2)-> 0.12) */
    round?: number;
    /** Number of bytes in the integer part with fixed point */
    fixedIntegerBytes?: number;
}) | (ObnizBleBeaconStructStandard<CustomType> & {
    /** Used only 'custom' */
    func: (data: number[], peripheral: BleRemotePeripheral) => S[key];
});
export declare type ObnizBleBeaconStructCheck = ObnizBleBeaconStructCheckWithData | ObnizBleBeaconStructCheckWithFunc;
declare type ObnizBleBeaconStructCheckWithData = ObnizBleBeaconStructStandard<CheckType> & {
    /** Compare data value, Used only 'check' */
    data: number | number[];
};
declare type ObnizBleBeaconStructCheckWithFunc = ObnizBleBeaconStructStandard<CheckType> & {
    /** Compare function with data value, Used only 'check' */
    func: (data: Uint8Array) => boolean;
};
export declare const notMatchDeviceError: Error;
export declare const fixedPoint: (value: number[] | Uint8Array, integerBytes: number) => number;
export declare const uint: (value: number[] | Uint8Array) => number;
export declare const int: (value: number[] | Uint8Array) => number;
export declare const uintBE: (value: number[] | Uint8Array) => number;
export declare const intBE: (value: number[] | Uint8Array) => number;
export declare const uintToArray: (value: number, length?: number) => Uint8Array;
export declare const uintToArrayWithBE: (value: number, length?: number) => Uint8Array;
export declare const fixByRange: (name: string, value: number, min: number, max: number) => number;
export declare const checkEquals: (base: number[] | Uint8Array, target: number[] | Uint8Array) => boolean;
export interface ObnizPartsBleProps extends ObnizPartsProps {
    readonly PartsName: PartsType;
    readonly AvailableBleMode: ObnizPartsBleMode | ObnizPartsBleMode[];
    readonly Address?: ObnizPartsBleCompareWithNonNull<RegExp>;
    readonly LocalName?: ObnizPartsBleCompareWithNonNull<RegExp>;
    readonly ServiceUuids?: ObnizPartsBleCompare<string | string[]>;
    readonly BeaconDataLength?: ObnizPartsBleCompare<number>;
    readonly BeaconDataLength_ScanResponse?: ObnizPartsBleCompare<number>;
    readonly CompanyID?: ObnizPartsBleCompare<number[]>;
    readonly CompanyID_ScanResponse?: ObnizPartsBleCompare<number[]>;
    readonly BeaconDataStruct?: ObnizPartsBleCompare<ObnizBleBeaconStruct<unknown>>;
    readonly ServiceDataLength?: ObnizPartsBleCompare<number>;
    readonly ServiceUUID?: ObnizPartsBleCompare<number[]>;
    readonly ServiceDataStruct?: ObnizPartsBleCompare<ObnizBleBeaconStruct<unknown>>;
    getServiceUuids(mode: ObnizPartsBleMode): string[] | null | undefined;
    getDeviceMode(peripheral: BleRemotePeripheral): ObnizPartsBleMode | null;
    new (peripheral: BleRemotePeripheral, mode: ObnizPartsBleMode): ObnizPartsBle<unknown>;
}
export declare abstract class ObnizPartsBle<S> {
    /**
     * Information of parts.
     * name: PartsName
     */
    static info(): ObnizPartsInfo;
    /**
     * Available BLE modes (Beacon | Connectable | Pairing)
     *
     * 利用可能なBLEのモード (Beacon | Connectable | Pairing)
     */
    static getAvailableBleMode(): ObnizPartsBleMode[];
    /**
     * Used as a condition of isDevice() by default.
     *
     * 標準でisDevice()の条件として使用
     */
    static readonly Address?: ObnizPartsBleCompareWithNonNull<RegExp>;
    /**
     * Used as a condition of isDevice() by default.
     *
     * 標準でisDevice()の条件として使用
     */
    static readonly LocalName?: ObnizPartsBleCompareWithNonNull<RegExp>;
    /**
     * Used as a condition of isDevice() by default.
     *
     * 標準でisDevice()の条件として使用
     */
    static readonly ServiceUuids?: ObnizPartsBleCompare<string | string[]>;
    static getServiceUuids(mode: ObnizPartsBleMode): string[] | null | undefined;
    /**
     * Used as a condition of isDevice() by default.
     *
     * 標準でisDevice()の条件として使用
     */
    static readonly BeaconDataLength?: ObnizPartsBleCompare<number>;
    /**
     * Overall length of manufacturer-specific data.
     * Used as a condition of isDevice() by default.
     *
     * 製造者固有データ全体の長さ
     * 標準でisDevice()の条件として使用
     */
    static readonly BeaconDataLength_ScanResponse?: ObnizPartsBleCompare<number>;
    /**
     * Used as a condition of isDevice() by default.
     *
     * 標準でisDevice()の条件として使用
     */
    static readonly CompanyID?: ObnizPartsBleCompare<number[]>;
    /**
     * Used as a condition of isDevice() by default.
     *
     * 標準でisDevice()の条件として使用
     */
    static readonly CompanyID_ScanResponse?: ObnizPartsBleCompare<number[]>;
    /**
     * Used as a condition of isDevice() by default.
     * Compare with data after Company ID.
     *
     * 標準でisDevice()の条件として使用
     * CompanyID以降のデータと比較
     */
    static readonly BeaconDataStruct?: ObnizPartsBleCompare<ObnizBleBeaconStruct<unknown>>;
    /**
     * Used as a condition of isDevice() by default.
     *
     * 標準でisDevice()の条件として使用
     */
    static readonly ServiceDataLength?: ObnizPartsBleCompare<number>;
    /**
     * Used as a condition of isDevice() by default.
     *
     * 標準でisDevice()の条件として使用
     */
    static readonly ServiceDataUUID?: ObnizPartsBleCompare<number[]>;
    /**
     * Used as a condition of isDevice() by default.
     * Compare with data after Service UUID.
     *
     * 標準でisDevice()の条件として使用
     * ServiceUUID以降のデータと比較
     */
    static readonly ServiceDataStruct?: ObnizPartsBleCompare<ObnizBleBeaconStruct<unknown>>;
    /**
     * @deprecated
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get Peripheral Mode.
     *
     * ペリフェラルのモードを取得
     *
     * @param peripheral BleRemotePeripheral
     * @returns If the corresponding device is that mode, it must be null if not applicable 該当するデバイスならばそのモード、該当しなければnull
     */
    static getDeviceMode(peripheral: BleRemotePeripheral): ObnizPartsBleMode | null;
    /**
     * Check if peripherals and modes match the library.
     *
     * ペリフェラルとモードがライブラリと合致するかチェック
     *
     * @param peripheral BleRemotePeripheral
     * @param mode Beacon | Connectable | Pairing
     * @returns Whether to match 合致するかどうか
     */
    static isDeviceWithMode(peripheral: BleRemotePeripheral, mode: ObnizPartsBleMode): boolean;
    private static checkCustomData;
    /**
     * Form advertising data into an associative array.
     *
     * アドバタイジングデータを連想配列に成形
     *
     * @deprecated
     */
    static getData(peripheral: BleRemotePeripheral): unknown | null;
    readonly peripheral: BleRemotePeripheral;
    readonly address: string;
    readonly beaconData: number[] | null;
    readonly beaconDataInScanResponse: number[] | null;
    readonly serviceData: number[] | null;
    protected _mode: ObnizPartsBleMode;
    get mode(): ObnizPartsBleMode;
    /**
     * NEED IMPLEMENTATION
     */
    protected abstract readonly staticClass: ObnizPartsBleProps;
    constructor(peripheral: BleRemotePeripheral, mode: ObnizPartsBleMode);
    checkMode(force?: boolean): ObnizPartsBleMode;
    /**
     * アドバタイジングデータを連想配列に成形
     *
     * 利用可能なモード: Beacon, Connectable(一部のみ)
     *
     * Form advertising data into an associative array
     *
     * Available modes: Beacon, Connectable(only part)
     */
    getData(): S;
    private getTriaxial;
}
export declare abstract class ObnizPartsBleConnectable<S, T> extends ObnizPartsBle<S> {
    constructor(peripheral: BleRemotePeripheral, mode: ObnizPartsBleMode);
    protected readonly disconnectedListeners: ((reason: unknown) => void | Promise<void>)[];
    /**
     * Register functions to be called on disconnection.
     *
     * Note: Registration is reset upon connection, so please register after connection.
     *
     * 切断時に呼ばれる関数を登録
     *
     * 注意: 接続時に登録がリセットされるため、接続後に登録してください
     *
     * @param func Function to be registered 登録したい関数
     */
    protected registerDisconnected(func: () => void): void;
    /**
     * Connect to peripherals with validation.
     *
     * バリデーションのあるペリフェラルへの接続
     *
     * @param keys: Key acquired when pairing previously 以前にペアリングしたときに取得されたキー
     * @param setting: Additional settings when connecting 接続時の追加設定
     */
    connectWait(keys?: string, setting?: BleConnectSetting): Promise<void>;
    /**
     * Disconnect from peripheral.
     *
     * ペリフェラルから切断
     */
    disconnectWait(): Promise<void>;
    /**
     * Get data during connection.
     *
     * 接続中にデータを取得
     */
    abstract getDataWait(): Promise<T>;
    /**
     * onDisconnect callback function.
     *
     * 切断された時に呼ばれるコールバック関数
     *
     * @param reason Reason for being disconnected 切断された理由
     */
    ondisconnect?: (reason: unknown) => void | Promise<void>;
    /**
     * Check if connected.
     *
     * 接続しているかどうかチェック
     *
     * @param connected Connection status (default: true)
     */
    protected checkConnected(connected?: boolean): void;
    /**
     * Get any characteristic from any service.
     *
     * 任意のサービスから任意のキャラクタリスティックを取得
     *
     * @param serviceUuid Service UUID
     * @param characteristicUuid Characteristic UUID
     * @returns Instance of BleRemoteCharacteristic
     */
    protected getChar(serviceUuid: string, characteristicUuid: string): BleRemoteCharacteristic;
    /**
     * Read data from any characteristic of any service.
     *
     * 任意のサービスの任意のキャラクタリスティックからデータを読み取り
     *
     * @param serviceUuid Service UUID
     * @param characteristicUuid Characteristic UUID
     * @returns Data read result データ読み取り結果
     */
    protected readCharWait(serviceUuid: string, characteristicUuid: string): Promise<number[]>;
    /**
     * Write data to any characteristic of any service.
     *
     * 任意のサービスの任意のキャラクタリスティックへデータを書き込み
     *
     * @param serviceUuid Service UUID
     * @param characteristicUuid Characteristic UUID
     * @param data Write data 書き込むデータ
     * @returns Data write result データ書き込み結果
     */
    protected writeCharWait(serviceUuid: string, characteristicUuid: string, data?: number[] | Uint8Array, needResponse?: boolean): Promise<boolean>;
    /**
     * Register notification to any characteristic of any service.
     *
     * 任意のサービスの任意のキャラクタリスティックへ通知を登録
     *
     * @param serviceUuid Service UUID
     * @param characteristicUuid Characteristic UUID
     * @param callback Function called when data arrives データが来たときに呼ばれる関数
     */
    protected subscribeWait(serviceUuid: string, characteristicUuid: string, callback?: (data: number[]) => void | Promise<void>): Promise<void>;
    /**
     * Unregister notification to any characteristic of any service.
     *
     * 任意のサービスの任意のキャラクタリスティックから通知登録を削除
     *
     * @param serviceUuid Service UUID
     * @param characteristicUuid Characteristic UUID
     */
    protected unsubscribeWait(serviceUuid: string, characteristicUuid: string): Promise<void>;
}
export declare abstract class ObnizPartsBlePairable<S, T> extends ObnizPartsBleConnectable<S, T> {
    /**
     * Disconnect request after pairing
     *
     * ペアリング後に切断要求を行う
     */
    protected requestDisconnectAfterPairing: boolean;
    /**
     * Wait for disconnect event at the end of pairing
     *
     * ペアリングの終了時には切断イベントを待つ
     */
    protected waitDisconnectAfterPairing: boolean;
    /**
     * After pairing and before disconnect
     *
     * ペアリング後、切断前に行う操作
     */
    protected afterPairingWait(): Promise<void>;
    /**
     * Perform pairing
     *
     * ペアリングを実行
     *
     * @returns Pairing key ペアリングキー
     */
    pairingWait(): Promise<string | null>;
}
export declare const iBeaconCompanyID: number[];
export declare const iBeaconDataWithStrict: ObnizBleBeaconStructStrict<IBeacon, 'type'>;
export declare const iBeaconData: ObnizBleBeaconStruct<IBeacon>;
export {};
