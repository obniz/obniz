export = PeripheralIO;
declare class PeripheralIO {
    constructor(Obniz: any, id: any);
    Obniz: any;
    id: any;
    _reset(): void;
    value: any;
    observers: any[] | undefined;
    addObserver(callback: any): void;
    output(value: any): void;
    drive(drive: any): void;
    pull(updown: any): void;
    input(callback: any): any;
    onchange: any;
    inputWait(): Promise<any>;
    end(): void;
    notified(obj: any): void;
}
