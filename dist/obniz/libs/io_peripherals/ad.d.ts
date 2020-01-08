export = PeripheralAD;
declare class PeripheralAD {
    constructor(Obniz: any, id: any);
    Obniz: any;
    id: any;
    _reset(): void;
    value: any;
    observers: any[] | undefined;
    addObserver(callback: any): void;
    start(callback: any): any;
    onchange: any;
    getWait(): Promise<any>;
    end(): void;
    notified(obj: any): void;
}
