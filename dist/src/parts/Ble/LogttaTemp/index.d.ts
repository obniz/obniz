/**
 * @packageDocumentation
 * @module Parts.Logtta_TH
 */
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";
export interface Logtta_THOptions {
}
export interface Logtta_TH_Data {
    temperature: number;
    humidity: number;
}
export interface Logtta_TH_Adv_Data {
    temperature: number;
    humidity: number;
    battery: number;
    interval: number;
    address: string;
}
export default class Logtta_TH implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    static isAdvDevice(peripheral: BleRemotePeripheral): boolean;
    static getData(peripheral: BleRemotePeripheral): Logtta_TH_Adv_Data | null;
    private static getName;
    private static get_uuid;
    onNotify?: (data: Logtta_TH_Data) => void;
    _peripheral: null | BleRemotePeripheral;
    ondisconnect?: (reason: any) => void;
    constructor(peripheral: BleRemotePeripheral | null);
    connectWait(): Promise<void>;
    disconnectWait(): Promise<void>;
    getAllWait(): Promise<Logtta_TH_Data | null>;
    getTemperatureWait(): Promise<number>;
    getHumidityWait(): Promise<number>;
    startNotifyWait(): Promise<void>;
    authPinCodeWait(code: string): Promise<void>;
    setBeaconMode(enable: boolean): Promise<void>;
    private checkNumber;
}
