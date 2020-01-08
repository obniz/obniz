export = ObnizBLEHci;
declare class ObnizBLEHci {
    constructor(Obniz: any);
    Obniz: any;
    write(hciCommand: any): void;
    notified(obj: any): void;
    onread(): void;
}
