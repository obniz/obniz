export = ObnizBLE;
declare class ObnizBLE {
    static _dataArray2uuidHex(data: any, reverse: any): string;
    constructor(Obniz: any);
    Obniz: any;
    remotePeripherals: any[];
    service: any;
    characteristic: any;
    descriptor: any;
    peripheral: any;
    scanTarget: any;
    advertisement: any;
    scan: any;
    security: any;
    initWait(): Promise<void>;
    _reset(): void;
    directConnect(uuid: any, addressType: any): void;
    directConnectWait(uuid: any, addressType: any): Promise<void>;
    findPeripheral(address: any): any;
    notified(obj: any): void;
}
