/**
 * @packageDocumentation
 * @module Parts.Logtta_TH
 */
import BleRemotePeripheral from '../../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleCompare, ObnizPartsBleConnectable, ObnizPartsBleMode } from '../../../../obniz/ObnizPartsBleAbstract';
import BleBatteryService from '../services/batteryService';
import BleGenericAccess from '../services/genericAccess';
declare type PinCodeType = 'Authentication' | 'Rewrite';
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
    connectWait(keys?: string): Promise<void>;
    protected beforeOnDisconnectWait(): Promise<void>;
    getDataWait(): Promise<T>;
    startNotifyWait(callback: (data: T) => void): Promise<void>;
    authPinCodeWait(code: string | number): Promise<boolean>;
    protected sendPinCodeWait(type: PinCodeType, code: number): Promise<boolean>;
    protected checkAuthenticated(): void;
    setBeaconModeWait(enable: boolean): Promise<boolean>;
    protected getName(): string;
    protected getCharUuid(code: number): string;
    protected abstract parseData(data: number[]): T;
}
export {};
