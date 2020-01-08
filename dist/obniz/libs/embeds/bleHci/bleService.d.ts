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
    get characteristics(): any;
    get advData(): {
        flags: string[];
        serviceUuids: any[];
    };
    end(): void;
    emit(name: any, ...params: any[]): void;
    notify(notifyName: any, params: any): void;
}
