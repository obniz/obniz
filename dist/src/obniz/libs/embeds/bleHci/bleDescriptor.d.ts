/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleLocalAttributeAbstract from "./bleLocalAttributeAbstract";
/**
 * @category Use as Peripheral
 */
export default class BleDescriptor extends BleLocalAttributeAbstract {
    permissions: any;
    constructor(obj: any);
    get parentName(): string | null;
    addPermission(param: any): void;
    removePermission(param: any): void;
    toJSON(): any;
}
