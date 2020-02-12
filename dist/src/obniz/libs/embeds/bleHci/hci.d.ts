/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
export default class ObnizBLEHci {
    Obniz: any;
    constructor(Obniz: any);
    write(hciCommand: any): void;
    notified(obj: any): void;
    onread(data: any): void;
}
