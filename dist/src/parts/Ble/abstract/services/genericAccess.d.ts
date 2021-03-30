/**
 * @packageDocumentation
 * @module Parts.abstract.services
 */
import BleRemoteService from "../../../../obniz/libs/embeds/bleHci/bleRemoteService";
export default class BleGenericAccess {
    private _service;
    constructor(service: BleRemoteService);
    getDeviceNameWait(): Promise<string | null>;
}
