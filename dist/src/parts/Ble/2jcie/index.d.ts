/**
 * @packageDocumentation
 * @module Parts.OMRON_2JCIE
 */
import Obniz from "../../../obniz";
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface from "../../../obniz/ObnizPartsBleInterface";
import { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface OMRON_2JCIEOptions {
}
export interface OMRON_2JCIE_Data {
    row_number: number;
    temperature: number;
    relative_humidity: number;
    light: number;
    uv_index: number;
    barometric_pressure: number;
    soud_noise: number;
    discomfort_index: number;
    heatstroke_risk_factor: number;
    battery_voltage: number;
}
export interface OMRON_2JCIE_AdvData {
    temperature: number;
    relative_humidity: number;
    light: number;
    uv_index: number;
    barometric_pressure: number;
    soud_noise: number;
    acceleration_x: number;
    acceleration_y: number;
    acceleration_z: number;
    battery: number;
}
export interface OMRON_2JCIE_AdvSensorData {
    temperature: number;
    relative_humidity: number;
    light: number;
    barometric_pressure: number;
    soud_noise: number;
    etvoc: number;
    eco2: number;
}
export default class OMRON_2JCIE implements ObnizPartsBleInterface {
    static info(): ObnizPartsInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean | "" | null;
    /**
     * Get a datas from advertisement mode of OMRON 2JCIE
     */
    static getData(peripheral: BleRemotePeripheral): OMRON_2JCIE_AdvData | OMRON_2JCIE_AdvSensorData | null;
    _peripheral: BleRemotePeripheral | null;
    obniz: Obniz;
    params: any;
    ondisconnect?: (reason: any) => void;
    constructor(peripheral: BleRemotePeripheral | null);
    wired(obniz: Obniz): void;
    findWait(): Promise<any>;
    omron_uuid(uuid: string): string;
    connectWait(): Promise<void>;
    disconnectWait(): Promise<void>;
    signedNumberFromBinary(data: number[]): number;
    unsignedNumberFromBinary(data: number[]): number;
    getLatestData(): Promise<OMRON_2JCIE_Data>;
}
