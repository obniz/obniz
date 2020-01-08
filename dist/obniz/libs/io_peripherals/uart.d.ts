export = PeripheralUART;
declare class PeripheralUART {
    constructor(Obniz: any, id: any);
    Obniz: any;
    id: any;
    _reset(): void;
    received: any[] | Uint8Array | undefined;
    used: boolean | undefined;
    start(params: any): void;
    params: any;
    send(data: any): void;
    isDataExists(): boolean | undefined;
    readBytes(): any[];
    readByte(): number | null;
    readText(): any;
    tryConvertString(data: any): any;
    notified(obj: any): void;
    isUsed(): boolean | undefined;
    end(): void;
}
