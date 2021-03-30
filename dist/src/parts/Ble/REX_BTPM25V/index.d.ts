/**
 * @packageDocumentation
 * @module Parts.REX_BTPM25V
 */
import Obniz from "../../../obniz";
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface REX_BTPM25VOptions {
}
export default class REX_BTPM25V implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    keys: string[];
    requiredKeys: string[];
    params: any;
    onbuttonpressed: ((pressed: boolean) => void) | null;
    _peripheral: BleRemotePeripheral | null;
    ondisconnect?: (reason: any) => void;
    private _uuids;
    private _oneShotMeasurementCharacteristic;
    private _continuousMeasurementCharacteristic;
    private _ledCharacteristic;
    private _buttonCharacteristic;
    constructor(peripheral: BleRemotePeripheral | null);
    wired(obniz: Obniz): void;
    connectWait(): Promise<void>;
    disconnectWait(): Promise<void>;
    measureOneShotWait(): Promise<{
        pm2_5: number;
        pm10: number;
        barometricPressure: number;
        temperature: number;
        humidity: number;
        lux: number;
        mode: number;
    }>;
    measureOneShotExtWait(): Promise<{
        pm2_5: number;
        pm10: number;
        barometricPressure: number;
        temperature: number;
        humidity: number;
        lux: number;
        tvoc: number;
        eco2: number;
        uv: number;
    }>;
    getLedMode(): Promise<void>;
    private _sendAndReceiveWait;
    private _analyzeResult;
    private _bitValue;
    private _analyzeResultExt;
}
