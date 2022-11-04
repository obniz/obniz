/**
 * @packageDocumentation
 * @module Parts.utils.services
 */
import { BleRemoteService } from '../../../../obniz/libs/embeds/bleHci/bleRemoteService';
export declare class BleBatteryService {
    private _service;
    constructor(service: BleRemoteService);
    getBatteryLevelWait(): Promise<number | null>;
    getBatteryLevel(): Promise<number | null>;
}
