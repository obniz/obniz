/**
 * @packageDocumentation
 * @module Parts.abstract.services
 */
import BleRemoteService from "../../../../obniz/libs/embeds/bleHci/bleRemoteService";
export default class BleBatteryService {
    private _service;
    constructor(service: BleRemoteService);
    getBatteryLevelWait(): Promise<number | null>;
    getBatteryLevel(): Promise<number | null>;
}
