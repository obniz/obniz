declare class PeripheralIO {
    Obniz: any;
    id: any;
    value: any;
    observers: any;
    onchange: any;
    constructor(Obniz: any, id: any);
    _reset(): void;
    addObserver(callback: any): void;
    output(value: any): void;
    drive(drive: any): void;
    pull(updown: any): void;
    input(callback: any): any;
    inputWait(): Promise<{}>;
    end(): void;
    notified(obj: any): void;
}
export default PeripheralIO;
