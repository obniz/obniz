export = BlePeripheral;
declare class BlePeripheral {
    constructor(obnizBle: any);
    obnizBle: any;
    _services: any;
    currentConnectedDeviceAddress: any;
    _updateServices(): void;
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
