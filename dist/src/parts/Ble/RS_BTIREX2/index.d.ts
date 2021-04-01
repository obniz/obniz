/**
 * @packageDocumentation
 * @module Parts.RS_BTIREX2
 */
import Obniz from "../../../obniz";
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface RS_BTIREX2Options {
}
export default class RS_BTIREX2 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    keys: string[];
    requiredKeys: string[];
    params: any;
    onbuttonpressed: ((pressed: boolean) => void) | null;
    private _uuids;
    private _peripheral;
    private _rxCharacteristic;
    private _txCharacteristic;
    constructor(peripheral: BleRemotePeripheral | null);
    wired(obniz: Obniz): void;
    connectWait(): Promise<void>;
    _sendAndReceiveWait(payload: number[], crc?: number): Promise<number[]>;
}
