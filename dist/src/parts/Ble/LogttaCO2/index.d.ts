/**
 * @packageDocumentation
 * @module Parts.Logtta_CO2
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizBleBeaconStruct, ObnizPartsBle, ObnizPartsBleCompareWithMode, ObnizPartsBleMode, PartsType } from '../../../obniz/ObnizPartsBleInterface';
import BleBatteryService from '../utils/services/batteryService';
import BleGenericAccess from '../utils/services/genericAccess';
export interface Logtta_CO2Options {
}
export interface Logtta_CO2_Adv_Data {
    co2: number;
    battery: number;
    interval: number;
}
export default class Logtta_CO2 extends ObnizPartsBle<Logtta_CO2_Adv_Data> {
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
    static readonly BeaconDataStruct: ObnizPartsBleCompareWithMode<ObnizBleBeaconStruct<Logtta_CO2_Adv_Data> | null>;
    protected static: typeof ObnizPartsBle;
    /**
     * not used
     *
     * @returns name
     */
    protected getName(): string;
    protected static getUuid(uuid: string): string;
    onNotify?: (co2: number) => void;
    genericAccess?: BleGenericAccess;
    batteryService?: BleBatteryService;
    connectWait(): Promise<void>;
    disconnectWait(): Promise<void>;
    getWait(): Promise<number | null>;
    startNotifyWait(callback: (co2: number) => void): Promise<boolean>;
    authPinCodeWait(code: string): Promise<boolean>;
    /**
     * @deprecated
     * @param enable
     */
    setBeaconMode(enable: boolean): Promise<boolean>;
    setBeaconModeWait(enable: boolean): Promise<boolean>;
    protected checkNumber(data: string): number;
    /**
     * @deprecated
     */
    static getData(peripheral: BleRemotePeripheral): Logtta_CO2_Adv_Data | null;
}
