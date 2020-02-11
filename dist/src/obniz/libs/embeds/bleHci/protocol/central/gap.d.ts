/// <reference types="node" />
import events from "events";
/**
 * @ignore
 */
declare class Gap extends events.EventEmitter {
    _hci: any;
    _scanState: any;
    _scanFilterDuplicates: any;
    _discoveries: any;
    _advertiseState: any;
    constructor(hci: any);
    startScanning(allowDuplicates: boolean): void;
    stopScanning(): void;
    onHciLeScanParametersSet(): void;
    onHciLeScanEnableSet(status: any): void;
    onLeScanEnableSetCmd(enable: any, filterDuplicates?: any): void;
    onHciLeAdvertisingReport(status: any, type?: any, address?: any, addressType?: any, eir?: any, rssi?: any): void;
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
