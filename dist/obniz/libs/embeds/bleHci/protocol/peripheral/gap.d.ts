/// <reference types="node" />
export = Gap;
declare const Gap_base: typeof import("events").EventEmitter;
declare class Gap extends Gap_base {
    constructor(hci: any);
    _hci: any;
    _advertiseState: string | null;
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
