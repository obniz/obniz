/**
 * @packageDocumentation
 * @module Parts.PLS_01BT
 */
import Obniz from "../../../obniz";
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface PLS_01BTResult {
    pulseRate: number;
    bloodOxygenLevel: number;
    perfusionIndex: number;
}
export interface PLS_01BTOptions {
}
export default class PLS_01BT implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    keys: string[];
    requiredKeys: string[];
    params: any;
    onmesured: ((result: PLS_01BTResult) => void) | null;
    ondisconnect?: (reason: any) => void;
    private _uuids;
    private _peripheral;
    private _rxCharacteristic;
    private _txCharacteristic;
    constructor(peripheral: BleRemotePeripheral | null);
    wired(obniz: Obniz): void;
    connectWait(): Promise<void>;
    disconnectWait(): Promise<void>;
}
