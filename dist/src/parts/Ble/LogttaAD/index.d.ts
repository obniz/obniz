/**
 * @packageDocumentation
 * @module Parts.Logtta_AD
 */
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";
export interface Logtta_ADOptions {
}
export interface Logtta_AD_Data {
    ampere: number;
    volt: number;
    count: number;
}
export default class Logtta_AD implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    private static get_uuid;
    onNotify?: (data: Logtta_AD_Data) => void;
    _peripheral: null | BleRemotePeripheral;
    ondisconnect?: (reason: any) => void;
    constructor(peripheral: BleRemotePeripheral | null);
    connectWait(): Promise<void>;
    disconnectWait(): Promise<void>;
    getAllWait(): Promise<Logtta_AD_Data | null>;
    getAmpereWait(): Promise<number>;
    getVoltWait(): Promise<number>;
    getCountWait(): Promise<number>;
    startNotifyWait(): Promise<void>;
}
