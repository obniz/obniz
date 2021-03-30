/**
 * @packageDocumentation
 * @module Parts.MiniBreeze
 */
import Obniz from "../../../obniz";
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface from "../../../obniz/ObnizPartsBleInterface";
export interface MiniBreeze_InfoData {
    gasType: "none" | "HCHO" | "CO" | "CO2" | "Rn" | "PM1.0" | "PM2.5" | "PM10" | "unknown";
    sensVal: number;
    temperature: number;
    humidity: number;
    version: string;
    status: "BatteryEmpty" | "BatteryLow" | "BatteryNormal" | "BatteryCharging" | "Invalid";
    devName: string;
}
export interface MiniBreezeOptions {
}
export default class MiniBreeze implements ObnizPartsBleInterface {
    static info(): {
        name: string;
    };
    static gasType(): any;
    static status(): any;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    static getData(peripheral: BleRemotePeripheral): null | MiniBreeze_InfoData;
    private static _hasPrefix;
    _peripheral: null | BleRemotePeripheral;
    keys: string[];
    requiredKeys: string[];
    params: any;
    wired(obniz: Obniz): void;
}
