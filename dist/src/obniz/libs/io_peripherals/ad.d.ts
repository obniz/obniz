declare class PeripheralAD {
    Obniz: any;
    id: any;
    value: any;
    observers: any;
    onchange: any;
    constructor(Obniz: any, id: any);
    _reset(): void;
    addObserver(callback: any): void;
    start(callback: any): any;
    getWait(): Promise<{}>;
    end(): void;
    notified(obj: any): void;
}
export default PeripheralAD;
