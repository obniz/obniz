/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.old
 */
import BleAttributeAbstract from "./bleAttributeAbstract";
/**
 * @category Use as Peripheral
 */
export default class BleCharacteristic extends BleAttributeAbstract {
    addDescriptor: any;
    addChild: any;
    getDescriptor: any;
    getChild: any;
    properties: any;
    permissions: any;
    children: any;
    service: any;
    uuid: any;
    constructor(obj: any);
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
