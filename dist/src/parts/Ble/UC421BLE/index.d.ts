import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface UC421BLEOptions {
}
export interface UC421BLEWeightResult {
    height?: number;
    weight?: {
        unit: 'kg' | 'lb';
        value: number;
    };
    bmi?: number;
    timestamp?: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
    };
}
export declare type UserNo = number;
export interface UC421BLEUserInfoData {
    email?: string;
    firstName?: string;
    lastName?: string;
    birth?: {
        year: number;
        month: number;
        day: number;
    };
    gender?: 'male' | 'female' | 'unspecified';
    height?: number;
}
export default class UC421BLE implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean | "" | null;
    _peripheral: BleRemotePeripheral | null;
    ondisconnect?: (reason: any) => void;
    constructor(peripheral: BleRemotePeripheral);
    pairingWait(): Promise<string | null>;
    aquireNewUserNoWait(cc: number): Promise<UserNo>;
    authorizeUserWait(userNo: UserNo, cc: number): Promise<void>;
    updateUserInfoDataWait(userInfo: UC421BLEUserInfoData): Promise<void>;
    getUserInfoDataWait(): Promise<UC421BLEUserInfoData>;
    getWeightDataWait(): Promise<UC421BLEWeightResult[]>;
    private _toCcArr;
    private _getUserDataServiceWait;
    private _getWeightScaleServiceWait;
    private _getBodyCompositionServiceWait;
    private _getUserControlPointCharWait;
    private _getFirstNameCharWait;
    private _getLastNameCharWait;
    private _getEmailCharWait;
    private _getBirthCharWait;
    private _getGenderCharWait;
    private _getHeightCharWait;
    private _getWeightScaleMeasurementCharWait;
    private _getBodyCompositionMeasurementCharWait;
}
