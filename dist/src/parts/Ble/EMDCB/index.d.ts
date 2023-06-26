/**
 * @packageDocumentation
 * @module Parts.EMDCB
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface, ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface EMDCBOptions {
}
export interface EMDCB_Data {
    address: string;
    energy_level?: number;
    light_level_solar_cell?: number;
    light_level_sensor?: number;
    occupancy_status?: boolean;
    commissioning_info?: number[];
}
export default class EMDCB implements ObnizPartsBleInterface {
    _peripheral: BleRemotePeripheral | null;
    static info(): ObnizPartsBleInfo;
    /**
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     */
    static getData(peripheral: BleRemotePeripheral): EMDCB_Data | null;
    /**
     */
    static analyzeData(peripheral: BleRemotePeripheral): {
        backup_battery_voltage?: number | undefined;
        energy_level?: number | undefined;
        light_level_solar_cell?: number | undefined;
        light_level_sensor?: number | undefined;
        occupancy_status?: boolean | undefined;
        commissioning_info?: number[] | undefined;
    };
}
