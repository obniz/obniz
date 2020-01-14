declare class BlePeripheral {
    obnizBle: any;
    _services: any;
    currentConnectedDeviceAddress: any;
    constructor(obnizBle: any);
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
    onconnectionupdates(param: any): void;
    onerror(error: any): void;
}
export default BlePeripheral;
