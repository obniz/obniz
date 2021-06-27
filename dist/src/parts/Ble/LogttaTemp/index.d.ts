/**
 * @packageDocumentation
 * @module Parts.Logtta_TH
 */
import { ObnizBleBeaconStruct, ObnizPartsBleConnectable, ObnizPartsBleMode } from '../../../obniz/ObnizPartsBleAbstract';
export interface Logtta_THOptions {
}
export interface Logtta_TH_Data {
    temperature: number;
    humidity: number;
    battery: number;
    interval: number;
    address: string;
}
export interface Logtta_TH_Connected_Data {
    temperature: number;
    humidity: number;
}
declare type PinCodeType = 'Authentication' | 'Rewrite';
export default class Logtta_TH extends ObnizPartsBleConnectable<Logtta_TH_Data, Logtta_TH_Connected_Data> {
    static readonly PartsName = "Logtta_TH";
    static readonly AvailableBleMode: ObnizPartsBleMode[];
    static readonly LocalName: {
        Connectable: RegExp;
        Beacon: RegExp;
    };
    static readonly BeaconDataLength = 27;
    static readonly CompanyID: number[];
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<Logtta_TH_Data>;
    protected static parseTemperatureData(data: number[], func?: (value: number[]) => number): number;
    protected static parseHumidityData(data: number[], func?: (value: number[]) => number): number;
    protected readonly staticClass: typeof Logtta_TH;
    protected authenticated: boolean;
    onNotify?: (data: Logtta_TH_Connected_Data) => void;
    protected beforeOnDisconnectWait(): Promise<void>;
    getDataWait(): Promise<Logtta_TH_Connected_Data>;
    /** @deprecated */
    getAllWait(): Promise<Logtta_TH_Connected_Data | null>;
    getTemperatureWait(): Promise<number>;
    getHumidityWait(): Promise<number>;
    startNotifyWait(callback: (data: Logtta_TH_Connected_Data) => void): Promise<void>;
    authPinCodeWait(code: string | number): Promise<boolean>;
    protected sendPinCodeWait(type: PinCodeType, code: number): Promise<boolean>;
    protected checkAuthenticated(): void;
    /**
     * @deprecated
     * @param enable
     */
    setBeaconMode(enable: boolean): Promise<boolean>;
    setBeaconModeWait(enable: boolean): Promise<boolean>;
    protected getName(): string;
    protected getUuid(uuid: string): string;
}
export {};
