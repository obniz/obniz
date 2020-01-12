declare class PeripheralI2C {
    Obniz: any;
    id: any;
    onerror: any;
    observers: any;
    state: any;
    used: any;
    onwritten: any;
    constructor(Obniz: any, id: any);
    _reset(): void;
    addObserver(callback: any): void;
    start(arg: any): void;
    write(address: any, data: any): void;
    readWait(address: any, length: any): Promise<unknown>;
    notified(obj: any): void;
    isUsed(): any;
    end(): void;
}
export default PeripheralI2C;
