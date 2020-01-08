export = BleRemoteDescriptor;
declare const BleRemoteDescriptor_base: any;
declare class BleRemoteDescriptor extends BleRemoteDescriptor_base {
    [x: string]: any;
    constructor(params: any);
    get parentName(): string;
    read(): void;
    write(array: any, needResponse: any): void;
}
