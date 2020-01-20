import BleRemoteAttributeAbstract from "./bleRemoteAttributeAbstract";
declare class BleRemoteDescriptor extends BleRemoteAttributeAbstract {
    characteristic: any;
    uuid: any;
    constructor(params: any);
    get parentName(): string | null;
    read(): void;
    write(array: any): void;
}
export default BleRemoteDescriptor;
