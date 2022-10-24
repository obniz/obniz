/**
 * @packageDocumentation
 * @module ObnizCore
 */
import { BleRemoteCharacteristic } from './libs/embeds/bleHci/bleRemoteCharacteristic';
import { BleRemotePeripheral, IBeacon } from './libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsInfo, ObnizPartsProps } from './ObnizPartsInterface';
import { PartsType } from './ObnizPartsList';
declare const ObnizPartsBleModeList: readonly ["Beacon", "Connectable", "Pairing"];
export declare type ObnizPartsBleMode = typeof ObnizPartsBleModeList[number];
export declare type ObnizPartsBleCompare<S> = ObnizPartsBleCompareWithMode<S> | S;
export declare type ObnizPartsBleCompareWithMode<S> = {
    [key in ObnizPartsBleMode]?: S;
};
declare type NumberType = 'numLE' | 'numBE' | 'unsignedNumLE' | 'unsignedNumBE';
declare type BoolType = 'bool0001' | 'bool0010' | 'bool0100' | 'bool1000' | 'bool00010000' | 'bool00100000' | 'bool01000000' | 'bool10000000';
declare type OtherType = 'string' | 'xyz';
declare type CustomType = 'custom';
declare type CheckType = 'check';
export declare type NormalValueType = NumberType | BoolType | OtherType | CustomType;
export declare type ValueType = NormalValueType | CheckType;
export declare type ObnizBleBeaconStruct<S> = {
    [key in keyof S]: ObnizBleBeaconStructNormal<S, key>;
} & {
    [key in string]: ObnizBleBeaconStructCheck;
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
export declare type ObnizBleBeaconStructNormal<S, key extends keyof S> = ObnizBleBeaconStructStandard<NormalValueType> & {
    /** Default: 1 (ex: parseInt() * multiple) */
    multiple?: number;
    /** Number of bytes in the integer part with fixed point */
    fixedIntegerBytes?: number;
    /** round precision */
    round?: number;
    /** Required in array type, Only in xyz */
    /** Used only 'custom' */
    func?: (data: number[], peripheral: BleRemotePeripheral) => S[key];
};
export declare type ObnizBleBeaconStructCheck = ObnizBleBeaconStructStandard<ValueType> & {
    /** Compare data value, Used only 'check' */
    data?: number | number[];
};
export declare const notMatchDeviceError: Error;
export declare const fixedPoint: (value: number[], integerBytes: number) => number;
export declare const uint: (value: number[]) => number;
export declare const int: (value: number[]) => number;
export declare const uintBE: (value: number[]) => number;
export declare const intBE: (value: number[]) => number;
export declare const uintToArray: (value: number, length?: number) => number[];
export interface ObnizPartsBleProps extends ObnizPartsProps {
    readonly PartsName: PartsType;
    readonly AvailableBleMode: ObnizPartsBleMode | ObnizPartsBleMode[];
    readonly Address?: ObnizPartsBleCompare<RegExp>;
    readonly LocalName?: ObnizPartsBleCompare<RegExp>;
    readonly ServiceUuids?: ObnizPartsBleCompare<string | string[] | null>;
    readonly BeaconDataLength?: ObnizPartsBleCompare<number | null>;
    readonly BeaconDataLength_ScanResponse?: ObnizPartsBleCompare<number | null>;
    readonly CompanyID?: ObnizPartsBleCompare<number[] | null>;
    readonly CompanyID_ScanResponse?: ObnizPartsBleCompare<number[] | null>;
    readonly BeaconDataStruct?: ObnizPartsBleCompare<ObnizBleBeaconStruct<unknown> | null>;
    readonly ServiceDataLength?: ObnizPartsBleCompare<number | null>;
    readonly ServiceUUID?: ObnizPartsBleCompare<number[] | null>;
    readonly ServiceDataStruct?: ObnizPartsBleCompare<ObnizBleBeaconStruct<unknown> | null>;
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
    static readonly Address?: ObnizPartsBleCompare<RegExp>;
    /**
     * Used as a condition of isDevice() by default.
     *
     * 標準でisDevice()の条件として使用
     */
    static readonly LocalName?: ObnizPartsBleCompare<RegExp>;
    /**
     * Used as a condition of isDevice() by default.
     *
     * 標準でisDevice()の条件として使用
     */
    static readonly ServiceUuids?: ObnizPartsBleCompare<string | string[] | null>;
    static getServiceUuids(mode: ObnizPartsBleMode): string[] | null | undefined;
    /**
     * Used as a condition of isDevice() by default.
     *
     * 標準でisDevice()の条件として使用
     */
    static readonly BeaconDataLength?: ObnizPartsBleCompare<number | null>;
    /**
     * Used as a condition of isDevice() by default.
     *
     * 標準でisDevice()の条件として使用
     */
    static readonly BeaconDataLength_ScanResponse?: ObnizPartsBleCompare<number | null>;
    /**
     * Used as a condition of isDevice() by default.
     *
     * 標準でisDevice()の条件として使用
     */
    static readonly CompanyID?: ObnizPartsBleCompare<number[] | null>;
    /**
     * Used as a condition of isDevice() by default.
     *
     * 標準でisDevice()の条件として使用
     */
    static readonly CompanyID_ScanResponse?: ObnizPartsBleCompare<number[] | null>;
    /**
     * Used as a condition of isDevice() by default.
     * Compare with data after Company ID.
     *
     * 標準でisDevice()の条件として使用
     * CompanyID以降のデータと比較
     */
    static readonly BeaconDataStruct?: ObnizPartsBleCompare<ObnizBleBeaconStruct<unknown> | null>;
    /**
     * Used as a condition of isDevice() by default.
     *
     * 標準でisDevice()の条件として使用
     */
    static readonly ServiceDataLength?: ObnizPartsBleCompare<number | null>;
    /**
     * Used as a condition of isDevice() by default.
     *
     * 標準でisDevice()の条件として使用
     */
    static readonly ServiceDataUUID?: ObnizPartsBleCompare<number[] | null>;
    /**
     * Used as a condition of isDevice() by default.
     * Compare with data after Service UUID.
     *
     * 標準でisDevice()の条件として使用
     * ServiceUUID以降のデータと比較
     */
    static readonly ServiceDataStruct?: ObnizPartsBleCompare<ObnizBleBeaconStruct<unknown> | null>;
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
     * 利用可能なモード: Beacon, Connectable(一部のみ)
     * Form advertising data into an associative array
     * Available modes: Beacon, Connectable(only part)
     */
    getData(): S;
    private getTriaxial;
}
export declare abstract class ObnizPartsBleConnectable<S, T> extends ObnizPartsBle<S> {
    constructor(peripheral: BleRemotePeripheral, mode: ObnizPartsBleMode);
    /**
     * Connect to peripherals with validation.
     *
     * バリデーションのあるペリフェラルへの接続
     *
     * @param keys: Key acquired when pairing previously 以前にペアリングしたときに取得されたキー
     */
    connectWait(keys?: string): Promise<void>;
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
     * Initialization processing before calling this.ondisconnect().
     *
     * this.ondisconnect()を呼ぶ前の初期化処理
     *
     * @param reason Reason for being disconnected
     */
    protected abstract beforeOnDisconnectWait(reason: unknown): Promise<void>;
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
     * @param data Write data
     * @returns Data write result
     */
    protected writeCharWait(serviceUuid: string, characteristicUuid: string, data?: number[], needResponse?: boolean): Promise<boolean>;
    /**
     * Register notification to any characteristic of any service.
     *
     * 任意のサービスの任意のキャラクタリスティックへ通知を登録
     *
     * @param serviceUuid Service UUID
     * @param characteristicUuid Characteristic UUID
     * @param callback It is called when data comes
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
export declare const iBeaconCompanyID: number[];
export declare const iBeaconData: ObnizBleBeaconStruct<IBeacon>;
export {};
