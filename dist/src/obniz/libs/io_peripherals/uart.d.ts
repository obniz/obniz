declare class PeripheralUART {
    Obniz: any;
    id: any;
    received: any;
    used: any;
    params: any;
    onreceive: any;
    constructor(Obniz: any, id: any);
    _reset(): void;
    start(params: any): void;
    send(data: any): void;
    isDataExists(): boolean;
    readBytes(): any;
    readByte(): any;
    readText(): any;
    tryConvertString(data: any): any;
    notified(obj: any): void;
    isUsed(): any;
    end(): void;
}
export default PeripheralUART;
