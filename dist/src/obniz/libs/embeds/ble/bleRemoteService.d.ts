import BleRemoteAttributeAbstract from "./bleRemoteAttributeAbstract";
declare class BleRemoteService extends BleRemoteAttributeAbstract {
    children: any;
    addChild: any;
    getChild: any;
    discoverChildrenWait: any;
    peripheral: any;
    uuid: any;
    parent: any;
    constructor(obj: any);
    readonly parentName: string | null;
    readonly childrenClass: any;
    readonly childrenName: string | null;
    readonly characteristics: any;
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
export default BleRemoteService;
