/**
 * @packageDocumentation
 * @module ObnizCore
 */
import { BleRemoteCharacteristic, IBeacon, ObnizPartsInfo } from '.';
import BleRemotePeripheral from './libs/embeds/bleHci/bleRemotePeripheral';
import { PartsList } from './ObnizPartsList';
export interface ObnizPartsBleInfo {
    name: string;
    datasheet?: any;
}
export interface Triaxial {
    x: number;
    y: number;
    z: number;
}
export default abstract class ObnizPartsBleInterface {
    /**
     * Information of parts.
     * name: key name of parts
     */
    static info: () => ObnizPartsBleInfo;
    /**
     * Check founded BleRemotePeripheral is kind of this parts or not
     */
    static isDevice: (peripheral: BleRemotePeripheral) => boolean;
    /**
     * Utility function for reading 2 byte to signed number.
     */
    static signed16FromBinary(high: number, low: number): number;
    /**
     * Utility function for reading 4 byte to signed number.
     */
    static signed32FromBinary(byte3: number, byte2: number, byte1: number, byte0: number): number;
    /**
     * Utility function for reading 1byte fixed point number
     */
    static readFraction(byte: number): number;
    /**
     * Internally Used function for connection required devices
     */
    _peripheral: BleRemotePeripheral | null;
    /**
     * ondisconnect callback function.
     */
    ondisconnect?: (reason: any) => void;
}
export declare class UniqueAdData {
    [key: number]: number;
}
export declare type PartsType = keyof PartsList;
declare const ObnizPartsBleModeList: readonly ["Beacon", "Connectable", "Pairing"];
export declare type ObnizPartsBleMode = typeof ObnizPartsBleModeList[number];
export declare type ObnizPartsBleCompare<S> = ObnizPartsBleCompareWithMode<S> | S;
export declare type ObnizPartsBleCompareWithMode<S> = {
    [key in ObnizPartsBleMode]?: S;
};
export declare const notMatchDeviceError: Error;
export declare const uint: (value: number[]) => number;
export declare const uint16: (value: number[]) => number;
export declare const uint16BE: (value: number[]) => number;
export declare const int16: (value: number[]) => number;
export declare const int16BE: (value: number[]) => number;
export declare const unsigned16FromBinary: (high: number, low: number) => number;
/**
 * Utility function for reading 2 byte to signed number.
 */
export declare const signed16FromBinary: (high: number, low: number) => number;
/**
 * Utility function for reading 4 byte to signed number.
 */
export declare const signed32FromBinary: (byte3: number, byte2: number, byte1: number, byte0: number) => number;
export declare abstract class ObnizPartsBle<S> {
    /**
     * Information of parts.
     * name: PartsName
     */
    static info(): ObnizPartsInfo;
    /**
     * NEED IMPLEMENTATION
     */
    static readonly PartsName: PartsType;
    /**
     * 利用可能なBLEのモード (Beacon | Connectable | Pairing)
     * Available BLE modes (Beacon | Connectable | Pairing)
     */
    static readonly AvailableBleMode: ObnizPartsBleMode | ObnizPartsBleMode[];
    /**
     * 標準でisDevice()の条件として使用
     * Used as a condition of isDevice() by default
     */
    protected static readonly Address?: ObnizPartsBleCompare<RegExp>;
    /**
     * 標準でisDevice()の条件として使用
     * Used as a condition of isDevice() by default
     */
    protected static readonly LocalName?: ObnizPartsBleCompare<RegExp>;
    /**
     * 標準でisDevice()の条件として使用
     * Used as a condition of isDevice() by default
     */
    protected static readonly CompanyID?: ObnizPartsBleCompare<number[] | null>;
    /**
     * 標準でisDevice()の条件として使用
     * Used as a condition of isDevice() by default
     */
    protected static readonly CompanyID_ScanResponse?: ObnizPartsBleCompare<number[] | null>;
    /**
     * 標準でisDevice()の条件として使用
     * CompanyID以降のデータと比較
     * Used as a condition of isDevice() by default
     * Compare with data after Company ID
     */
    static readonly BeaconDataStruct?: ObnizPartsBleCompare<ObnizBleBeaconStruct<unknown> | null>;
    /**
     * @deprecated
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    static getDeviceMode(peripheral: BleRemotePeripheral): ObnizPartsBleMode | null;
    static isDeviceWithMode(peripheral: BleRemotePeripheral, mode: ObnizPartsBleMode): boolean;
    private static checkManufacturerSpecificData;
    /**
     * アドバタイジングデータを連想配列に成形
     * Form advertising data into an associative array
     */
    /**
     * Utility function for reading 1byte fixed point number
     */
    static readFraction(byte: number): number;
    /**
     * Internally Used function for connection required devices
     */
    protected readonly peripheral: BleRemotePeripheral;
    readonly beaconData: number[] | null;
    readonly beaconDataInScanResponse: number[] | null;
    readonly mode: ObnizPartsBleMode;
    /**
     * NEED IMPLEMENTATION
     */
    protected readonly static: typeof ObnizPartsBle;
    /**
     * onDisconnect callback function.
     */
    onDisconnect?: (reason: unknown) => void;
    protected _onDisconnect?: (reason: unknown) => void;
    constructor(peripheral: BleRemotePeripheral, mode: ObnizPartsBleMode);
    /**
     * アドバタイジングデータを連想配列に成形
     * 利用可能なモード: Beacon, Connectable(一部のみ)
     * Form advertising data into an associative array
     * Available modes: Beacon, Connectable(only part)
     */
    getData(): S;
    private getTriaxial;
    /**
     * 任意のサービスから任意のキャラクタリスクを取得
     *
     * @param serviceUuid サービスUUID
     * @param characteristicUuid キャラクタリスクUUID
     * @returns 該当するものがあればキャラクタリスク、なければnull
     */
    protected getChar(serviceUuid: string, characteristicUuid: string): BleRemoteCharacteristic | null;
    /**
     * 任意のサービスの任意のキャラクタリスクからデータを読み取り
     *
     * @param serviceUuid サービスUUID
     * @param characteristicUuid キャラクタリスクUUID
     * @returns 該当するものがあればデータ読み取り結果、なければnull
     */
    protected readCharWait(serviceUuid: string, characteristicUuid: string): Promise<number[] | null>;
    /**
     * 任意のサービスの任意のキャラクタリスクへデータを書き込み
     *
     * @param serviceUuid サービスUUID
     * @param characteristicUuid キャラクタリスクUUID
     * @param data 書き込むデータ
     * @returns 該当するものがあればデータ書き込み結果、なければfalse
     */
    protected writeCharWait(serviceUuid: string, characteristicUuid: string, data?: number[]): Promise<boolean>;
    /**
     * 任意のサービスの任意のキャラクタリスクへ通知を登録
     *
     * @param serviceUuid サービスUUID
     * @param characteristicUuid キャラクタリスクUUID
     * @param callback データが来たとき呼ばれる関数
     * @returns 該当するものがあればtrue、なければfalse
     */
    protected subscribeWait(serviceUuid: string, characteristicUuid: string, callback?: (data: number[]) => void | Promise<void>): Promise<boolean>;
}
declare type NumberType = 'numLE' | 'numBE' | 'unsignedNumLE' | 'unsignedNumBE';
declare type BoolType = 'bool0001' | 'bool0010' | 'bool0100' | 'bool1000' | 'bool00010000' | 'bool00100000' | 'bool01000000' | 'bool10000000';
declare type OtherType = 'string' | 'xyz';
declare type CustomType = 'custom';
declare type CheckType = 'check';
declare type NormalValueType = NumberType | BoolType | OtherType | CustomType;
declare type ValueType = NormalValueType | CheckType;
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
    /** Required in array type, Only in xyz */
    /** Used only 'custom' */
    func?: (data: number[], peripheral: BleRemotePeripheral) => S[key];
};
export declare type ObnizBleBeaconStructCheck = ObnizBleBeaconStructStandard<ValueType> & {
    /** Compare data value, Used only 'check' */
    data?: number | number[];
};
export declare const iBeaconCompanyID: number[];
export declare const iBeaconData: ObnizBleBeaconStruct<IBeacon>;
export {};
