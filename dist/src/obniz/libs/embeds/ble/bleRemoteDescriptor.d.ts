import BleRemoteAttributeAbstract from "./bleRemoteAttributeAbstract";
declare class BleRemoteDescriptor extends BleRemoteAttributeAbstract {
    characteristic: any;
    uuid: any;
    constructor(params: any);
    readonly parentName: string | null;
    read(): void;
    write(array: any, needResponse: any): void;
}
export default BleRemoteDescriptor;
