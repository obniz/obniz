/**
 * @category Use as Peripheral
 */
export default class BlePeripheral {
    Obniz: any;
    _services: any;
    constructor(Obniz: any);
    get services(): any;
    addService(obj: any): void;
    setJson(json: any): void;
    getService(uuid: any): any;
    removeService(uuid: any): void;
    stopAllService(): void;
    toJSON(): {
        services: any;
    };
    findCharacteristic(param: any): any;
    findDescriptor(param: any): any;
    end(): void;
    onconnectionupdates(): void;
    onerror(): void;
}
