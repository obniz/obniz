declare class ObnizBLEHci {
    Obniz: any;
    constructor(Obniz: any);
    write(hciCommand: any): void;
    notified(obj: any): void;
    onread(data: any): void;
}
export default ObnizBLEHci;
