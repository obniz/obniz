/**
 * @packageDocumentation
 * @module Parts.RS_Seek3
 */
import Obniz from "../../../obniz";
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface from "../../../obniz/ObnizPartsBleInterface";
import { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface RS_Seek3Options {
}
export default class RS_Seek3 implements ObnizPartsBleInterface {
    static info(): ObnizPartsInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    keys: string[];
    requiredKeys: string[];
    params: any;
    onpressed: (() => void) | null;
    _peripheral: BleRemotePeripheral | null;
    ondisconnect?: (reason: any) => void;
    private _uuids;
    private _buttonCharacteristic;
    private _tempHumidCharacteristic;
    constructor(peripheral: BleRemotePeripheral | null);
    wired(obniz: Obniz): void;
    connectWait(): Promise<void>;
    disconnectWait(): Promise<void>;
    getTempHumidWait(): Promise<{
        temperature: number;
        humidity: number;
    }>;
}
