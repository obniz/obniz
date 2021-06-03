/**
 * @packageDocumentation
 * @module Parts.KankiAirMier
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface KankiAirMierOptions {
}
export interface KankiAirMier_Data {
    co2: number;
    temperature: number;
    humidity: number;
    sequenceNumber: number;
    deviceName: string;
}
export default class KankiAirMier implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    static getData(peripheral: BleRemotePeripheral): KankiAirMier_Data | null;
    private static _deviceAdvAnalyzer;
    _peripheral: BleRemotePeripheral | null;
}
