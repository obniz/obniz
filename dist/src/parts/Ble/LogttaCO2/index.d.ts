/**
 * @packageDocumentation
 * @module Parts.Logtta_CO2
 */
import { ObnizBleBeaconStruct, ObnizPartsBleCompare, ObnizPartsBleConnectable, ObnizPartsBleMode } from '../../../obniz/ObnizPartsBleAbstract';
import BleBatteryService from '../utils/services/batteryService';
import BleGenericAccess from '../utils/services/genericAccess';
export interface Logtta_CO2Options {
}
export interface Logtta_CO2_Data {
    co2: number;
    battery: number;
    interval: number;
    address: string;
}
export declare type Logtta_CO2_Connected_Data = number;
declare type PinCodeType = 'Authentication' | 'Rewrite';
export default class Logtta_CO2 extends ObnizPartsBleConnectable<Logtta_CO2_Data, Logtta_CO2_Connected_Data> {
    static readonly PartsName = "Logtta_CO2";
    static readonly AvailableBleMode: ObnizPartsBleMode[];
    static readonly LocalName: {
        Connectable: RegExp;
        Beacon: RegExp;
    };
    static readonly BeaconDataLength: {
        Connectable: undefined;
        Beacon: number;
    };
    static readonly CompanyID: {
        Connectable: undefined;
        Beacon: number[];
    };
    static readonly BeaconDataStruct: ObnizPartsBleCompare<ObnizBleBeaconStruct<Logtta_CO2_Data>>;
    protected readonly staticClass: typeof Logtta_CO2;
    protected authenticated: boolean;
    onNotify?: (co2: number) => void;
    genericAccess?: BleGenericAccess;
    batteryService?: BleBatteryService;
    connectWait(keys?: string): Promise<void>;
    protected beforeOnDisconnectWait(): Promise<void>;
    getDataWait(): Promise<number>;
    /** @deprecated */
    getWait(): Promise<number | null>;
    startNotifyWait(callback: (co2: number) => void): Promise<void>;
    authPinCodeWait(code: string | number): Promise<boolean>;
    changeAuthPinCodeWait(code: number): Promise<boolean>;
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
