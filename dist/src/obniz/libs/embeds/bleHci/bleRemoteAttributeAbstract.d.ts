/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleAttributeAbstract from "./bleAttributeAbstract";
/**
 * @category Use as Central
 */
export default class BleRemoteAttributeAbstract extends BleAttributeAbstract {
    isRemote: any;
    discoverdOnRemote: any;
    childrenName: any;
    emitter: any;
    children: any;
    getChild: any;
    addChild: any;
    constructor(params: any);
    get wsChildUuidName(): string | null;
    discoverChildren(): void;
    discoverChildrenWait(): Promise<unknown>;
    /**
     * CALLBACKS
     */
    ondiscover(child: any): void;
    ondiscoverfinished(children: any): void;
    notifyFromServer(notifyName: any, params: any): void;
}
