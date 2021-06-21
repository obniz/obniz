/**
 * @packageDocumentation
 * @module Parts.Logtta_CO2
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizBleBeaconStruct, ObnizPartsBle, ObnizPartsBleCompareWithMode, ObnizPartsBleConnectable, ObnizPartsBleMode, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import BleBatteryService from '../utils/services/batteryService';
import BleGenericAccess from '../utils/services/genericAccess';
export interface Logtta_CO2Options {
}
/** @deprecated */
export declare type Logtta_CO2_Adv_Data = Logtta_CO2_Data;
export interface Logtta_CO2_Data {
    co2: number;
    battery: number;
    interval: number;
    address: string;
}
declare type PinCodeType = 'Authentication' | 'Rewrite';
export default class Logtta_CO2 extends ObnizPartsBleConnectable<Logtta_CO2_Data, number> {
    static readonly PartsName: PartsType;
    static readonly AvailableBleMode: ObnizPartsBleMode[];
    protected static readonly LocalName: {
        Connectable: RegExp;
        Beacon: RegExp;
    };
    protected static readonly CompanyID: {
        Connectable: null;
        Beacon: number[];
    };
    protected static readonly BeaconDataStruct: ObnizPartsBleCompareWithMode<ObnizBleBeaconStruct<Logtta_CO2_Data> | null>;
    protected readonly static: typeof ObnizPartsBle;
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
    /**
     * @deprecated
     */
    static getData(peripheral: BleRemotePeripheral): Logtta_CO2_Data | null;
}
export {};
