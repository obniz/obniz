import BleAttributeAbstract from "./bleAttributeAbstract";
declare class BleDescriptor extends BleAttributeAbstract {
    permissions: any;
    characteristic: any;
    uuid: any;
    constructor(obj: any);
    readonly parentName: string | null;
    addPermission(param: any): void;
    removePermission(param: any): void;
    toJSON(): any;
    write(dataArray: any): void;
    read(): void;
}
export default BleDescriptor;
