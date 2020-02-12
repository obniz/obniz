/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.old
 */
import BleAttributeAbstract from "./bleAttributeAbstract";
/**
 * @category Use as Peripheral
 */
export default class BleDescriptor extends BleAttributeAbstract {
    permissions: any;
    characteristic: any;
    uuid: any;
    constructor(obj: any);
    get parentName(): string | null;
    addPermission(param: any): void;
    removePermission(param: any): void;
    toJSON(): any;
    write(dataArray: any): void;
    read(): void;
}
