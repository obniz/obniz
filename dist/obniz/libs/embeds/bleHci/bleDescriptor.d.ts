export = BleDescriptor;
declare const BleDescriptor_base: any;
declare class BleDescriptor extends BleDescriptor_base {
    [x: string]: any;
    constructor(obj: any);
    permissions: any;
    get parentName(): string;
    addPermission(param: any): void;
    removePermission(param: any): void;
    toJSON(): any;
}
