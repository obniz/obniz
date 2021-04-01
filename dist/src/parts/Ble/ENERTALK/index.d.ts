/**
 * @packageDocumentation
 * @module Parts.ENERTALK_TOUCH
 */
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface from "../../../obniz/ObnizPartsBleInterface";
import { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import BleBatteryService from "../abstract/services/batteryService";
export interface ENERTALK_TOUCHOptions {
}
export default class ENERTALK_TOUCH implements ObnizPartsBleInterface {
    static info(): ObnizPartsInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    keys: string[];
    requiredKeys: string[];
    params: any;
    onbuttonpressed: ((pressed: boolean) => void) | null;
    _peripheral: BleRemotePeripheral | null;
    ondisconnect?: (reason: any) => void;
    batteryService?: BleBatteryService;
    private _uuids;
    private _service;
    private _temperatureChar;
    private _humidityChar;
    private _illuminanceChar;
    private _accelerometerChar;
    constructor(peripheral: BleRemotePeripheral | null);
    connectWait(): Promise<void>;
    disconnectWait(): Promise<void>;
    getTemperatureWait(): Promise<number>;
    getHumidityWait(): Promise<number>;
    getIlluminationWait(): Promise<number>;
    getAccelerometerWait(): Promise<{
        x: number;
        y: number;
        z: number;
    }>;
}
