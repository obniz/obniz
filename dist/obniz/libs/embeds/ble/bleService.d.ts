export = BleService;
declare const BleService_base: any;
declare class BleService extends BleService_base {
    [x: string]: any;
    constructor(obj: any);
    addCharacteristic: any;
    getCharacteristic: any;
    get parentName(): string;
    get childrenName(): string;
    get childrenClass(): any;
    get advData(): {
        flags: string[];
        serviceUuids: any[];
    };
    end(): void;
    notify(notifyName: any, params: any): void;
}
