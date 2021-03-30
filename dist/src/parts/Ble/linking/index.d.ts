/**
 * @packageDocumentation
 * @module Parts.Linking
 */
import Obniz from "../../../obniz";
import bleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import LinkingAdvertising from "./modules/advertising";
import LinkingDevice from "./modules/device";
export interface LinkingOptions {
}
export default class Linking {
    static info(): ObnizPartsInfo;
    onadvertisement: any;
    ondiscover: any;
    PRIMARY_SERVICE_UUID_LIST: string[];
    _discover_status: any;
    _discover_wait: any;
    _discover_timer: any;
    _peripherals: any;
    initialized: boolean;
    keys: string[];
    requiredKeys: string[];
    periperal: bleRemotePeripheral | null;
    obniz: Obniz;
    get LinkingAdvertising(): typeof LinkingAdvertising;
    get LinkingDevice(): typeof LinkingDevice;
    constructor(params: any);
    wired(obniz: Obniz): void;
    init(): Promise<void>;
    discover(p: any): Promise<any[]>;
    _checkInitialized(): void;
    _discoveredDevice(peripheral: bleRemotePeripheral, name_filter: any, id_filter: any): LinkingDevice | null;
    _scanDevices(): void;
    stopScan(): void;
    startScan(p: any): void;
}
