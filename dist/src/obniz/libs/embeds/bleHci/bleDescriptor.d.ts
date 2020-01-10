import BleLocalAttributeAbstract from "./bleLocalAttributeAbstract";
declare class BleDescriptor extends BleLocalAttributeAbstract {
    permissions: any;
    constructor(obj: any);
    readonly parentName: string | null;
    addPermission(param: any): void;
    removePermission(param: any): void;
    toJSON(): any;
}
export default BleDescriptor;
