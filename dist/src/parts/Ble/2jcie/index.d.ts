import Obniz from "../../../obniz";
import bleRemotePeripheral from "../../../obniz/libs/embeds/ble/bleRemotePeripheral";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
/**
 * @category Parts
 */
export interface OMRON_2JCIEOptions {
}
/**
 * @category Parts
 */
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
/**
 * @category Parts
 */
export default class OMRON_2JCIE implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    periperal: bleRemotePeripheral | null;
    obniz: Obniz;
    constructor();
    wired(obniz: Obniz): void;
    findWait(): Promise<any>;
    omron_uuid(uuid: string): string;
    connectWait(): Promise<void>;
    disconnectWait(): Promise<void>;
    signedNumberFromBinary(data: number[]): number;
    unsignedNumberFromBinary(data: number[]): number;
    getLatestData(): Promise<OMRON_2JCIE_Data>;
}
