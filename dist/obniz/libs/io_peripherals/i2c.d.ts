export = PeripheralI2C;
declare class PeripheralI2C {
    constructor(Obniz: any, id: any);
    Obniz: any;
    id: any;
    onerror: any;
    _reset(): void;
    observers: any[] | undefined;
    state: any;
    used: boolean | undefined;
    onwritten: any;
    addObserver(callback: any): void;
    start(arg: any): void;
    write(address: any, data: any): void;
    readWait(address: any, length: any): Promise<any>;
    notified(obj: any): void;
    isUsed(): boolean | undefined;
    end(): void;
}
