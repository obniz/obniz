import BleRemoteAttributeAbstract from "./bleRemoteAttributeAbstract";
/**
 * @category Use as Central
 */
export default class BleRemoteService extends BleRemoteAttributeAbstract {
    children: any;
    addChild: any;
    getChild: any;
    discoverChildrenWait: any;
    peripheral: any;
    uuid: any;
    parent: any;
    constructor(obj: any);
    get parentName(): string | null;
    get childrenClass(): any;
    get childrenName(): string | null;
    get characteristics(): any;
    addCharacteristic(params: any): any;
    getCharacteristic(params: any): any;
    discoverAllCharacteristics(): void;
    discoverAllCharacteristicsWait(): any;
    discoverChildren(): void;
    ondiscover(characteristic: any): void;
    ondiscoverfinished(characteristics: any): void;
    ondiscovercharacteristic(characteristic: any): void;
    ondiscovercharacteristicfinished(characteristics: any[]): void;
}
