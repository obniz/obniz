/**
 * @packageDocumentation
 *
 * @ignore
 */
import EventEmitter from "eventemitter3";
import Hci from "../hci";
declare type GapEventTypes = "";
/**
 * @ignore
 */
declare class Gap extends EventEmitter<GapEventTypes> {
    _hci: Hci;
    _advertiseState: any;
    constructor(hci: any);
    /**
     * @ignore
     * @private
     */
    _reset(): void;
    startAdvertisingWait(name: any, serviceUuids: any): Promise<void>;
    startAdvertisingIBeaconWait(data: any): Promise<void>;
    startAdvertisingWithEIRDataWait(advertisementData: any, scanData: any): Promise<void>;
    restartAdvertisingWait(): Promise<void>;
    stopAdvertisingWait(): Promise<void>;
}
export default Gap;
