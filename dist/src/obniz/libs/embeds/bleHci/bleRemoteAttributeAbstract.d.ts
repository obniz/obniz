/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import { BleAttributeAbstract } from './bleAttributeAbstract';
/**
 * @category Use as Central
 */
export declare abstract class BleRemoteAttributeAbstract<ParentClass, ChildrenClass> extends BleAttributeAbstract<ParentClass, ChildrenClass> {
    constructor(params: any);
    /**
     * @ignore
     */
    get wsChildUuidName(): string | null;
    /**
     * @ignore
     * @param child
     */
    abstract ondiscover(child: any): void;
    /**
     * @ignore
     * @param children
     */
    abstract ondiscoverfinished(children: any): void;
}
