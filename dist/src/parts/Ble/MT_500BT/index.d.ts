/**
 * @packageDocumentation
 * @module Parts.MT_500BT
 */
import Obniz from "../../../obniz";
import BleRemoteCharacteristic from "../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic";
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import BleRemoteService from "../../../obniz/libs/embeds/bleHci/bleRemoteService";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import BleGenericAccess from "../abstract/services/genericAccess";
export interface MT_500BTOptions {
}
export default class MT_500BT implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    static getIFUID(peripheral: BleRemotePeripheral): number | null;
    static getCNKey(peripheral: BleRemotePeripheral): number | null;
    keys: string[];
    requiredKeys: string[];
    params: any;
    ondisconnect?: (reason: any) => void;
    genericAccess?: BleGenericAccess;
    MSDPService?: BleRemoteService;
    MSDPRxChar?: BleRemoteCharacteristic;
    MSDPTxChar?: BleRemoteCharacteristic;
    private _emitter;
    private _uuids;
    private _peripheral;
    constructor(peripheral: BleRemotePeripheral);
    wired(obniz: Obniz): void;
    connectWait(): Promise<void>;
    startCommunicationCommandWait(): Promise<void>;
    getDeviceInformationWait(): Promise<any>;
    getTemperatureWait(): Promise<any>;
    disconnectWait(): Promise<void>;
    private _createCommand;
    private _checksum;
    private _sendDataReplyWait;
}
