/// <reference types="node" />
export = Gap;
declare const Gap_base: typeof import("events").EventEmitter;
declare class Gap extends Gap_base {
    constructor(hci: any);
    _hci: any;
    _scanState: string | null;
    _scanFilterDuplicates: any;
    _discoveries: {};
    startScanning(allowDuplicates: any): void;
    stopScanning(): void;
    onHciLeScanParametersSet(): void;
    onHciLeScanEnableSet(status: any): void;
    onLeScanEnableSetCmd(enable: any, filterDuplicates: any): void;
    onHciLeAdvertisingReport(status: any, type: any, address: any, addressType: any, eir: any, rssi: any): void;
    startAdvertising(name: any, serviceUuids: any): void;
    startAdvertisingIBeacon(data: any): void;
    startAdvertisingWithEIRData(advertisementData: any, scanData: any): void;
    _advertiseState: string | undefined;
    restartAdvertising(): void;
    stopAdvertising(): void;
    onHciError(error: any): void;
    onHciLeAdvertisingParametersSet(status: any): void;
    onHciLeAdvertisingDataSet(status: any): void;
    onHciLeScanResponseDataSet(status: any): void;
    onHciLeAdvertiseEnableSet(status: any): void;
    addListener(event: string | symbol, listener: (...args: any[]) => void): Gap;
    on(event: string | symbol, listener: (...args: any[]) => void): Gap;
    once(event: string | symbol, listener: (...args: any[]) => void): Gap;
    prependListener(event: string | symbol, listener: (...args: any[]) => void): Gap;
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): Gap;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): Gap;
    off(event: string | symbol, listener: (...args: any[]) => void): Gap;
    removeAllListeners(event?: string | symbol | undefined): Gap;
    setMaxListeners(n: number): Gap;
}
