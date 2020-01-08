export = BleCharacteristic;
declare const BleCharacteristic_base: any;
declare class BleCharacteristic extends BleCharacteristic_base {
    [x: string]: any;
    constructor(obj: any);
    addDescriptor: any;
    getDescriptor: any;
    properties: any;
    permissions: any;
    get parentName(): string;
    get childrenClass(): any;
    get childrenName(): string;
    get descriptors(): any;
    toJSON(): any;
    addProperty(param: any): void;
    removeProperty(param: any): void;
    addPermission(param: any): void;
    removePermission(param: any): void;
    write(data: any): void;
    read(): void;
    notify(): void;
}
