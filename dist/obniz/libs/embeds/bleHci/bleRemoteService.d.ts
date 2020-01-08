export = BleRemoteService;
declare const BleRemoteService_base: any;
declare class BleRemoteService extends BleRemoteService_base {
    [x: string]: any;
    constructor(obj: any);
    get parentName(): string;
    get childrenClass(): any;
    get childrenName(): string;
    get characteristics(): any;
    addCharacteristic(params: any): any;
    getCharacteristic(params: any): any;
    discoverAllCharacteristics(): void;
    discoverAllCharacteristicsWait(): any;
    discoverChildren(): void;
    ondiscover(characteristic: any): void;
    ondiscoverfinished(characteristics: any): void;
    ondiscovercharacteristic(): void;
    ondiscovercharacteristicfinished(): void;
}
