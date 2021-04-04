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
    sound_noise: number;
    discomfort_index: number;
    heatstroke_risk_factor: number;
    battery_voltage: number;
}
export interface OMRON_2JCIE_USBSenData {
    seqence_number: number;
    temperature: number;
    relative_humidity: number;
    light: number;
    barometric_pressure: number;
    sound_noise: number;
    etvoc: number;
    eco2: number;
}
export interface OMRON_2JCIE_USBCalData {
    sequence_number: number;
    disconfort_index: number;
    heatstroke_risk_factor: number;
    vibration_information: number;
    si_value: number;
    pga: number;
    seismic_intensity: number;
    acceleration_x: number;
    acceleration_y: number;
    acceleration_z: number;
}
export interface OMRON_2JCIE_AdvData {
    temperature: number;
    relative_humidity: number;
    light: number;
    uv_index: number;
    barometric_pressure: number;
    sound_noise: number;
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
    sound_noise: number;
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
    private vibrationState;
    constructor(peripheral: BleRemotePeripheral | null);
    wired(obniz: Obniz): void;
    findWait(): Promise<any>;
    omron_uuid(uuid: string, type: string): string | any;
    connectWait(): Promise<void>;
    disconnectWait(): Promise<void>;
    signedNumberFromBinary(data: number[]): number;
    unsignedNumberFromBinary(data: number[]): number;
    getLatestDataBAG(): Promise<OMRON_2JCIE_Data>;
    getLatestSensorDataUSB(): Promise<OMRON_2JCIE_USBSenData>;
    getLatestCalclationDataUSB(): Promise<OMRON_2JCIE_USBCalData>;
}
