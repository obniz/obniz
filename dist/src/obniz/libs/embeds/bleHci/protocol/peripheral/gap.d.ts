/// <reference types="node" />
import events from "events";
/**
 * @ignore
 */
declare class Gap extends events.EventEmitter {
    _hci: any;
    _advertiseState: any;
    constructor(hci: any);
    startAdvertising(name: any, serviceUuids: any): void;
    startAdvertisingIBeacon(data: any): void;
    startAdvertisingWithEIRData(advertisementData: any, scanData: any): void;
    restartAdvertising(): void;
    stopAdvertising(): void;
    onHciError(error: any): void;
    onHciLeAdvertisingParametersSet(status: any): void;
    onHciLeAdvertisingDataSet(status: any): void;
    onHciLeScanResponseDataSet(status: any): void;
    onHciLeAdvertiseEnableSet(status: any): void;
}
export default Gap;
