/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleRemoteAttributeAbstract from "./bleRemoteAttributeAbstract";
/**
 * @category Use as Central
 */
export default class BleRemoteDescriptor extends BleRemoteAttributeAbstract {
    characteristic: any;
    uuid: any;
    constructor(params: any);
    get parentName(): string | null;
    read(): void;
    write(array: any): void;
}
