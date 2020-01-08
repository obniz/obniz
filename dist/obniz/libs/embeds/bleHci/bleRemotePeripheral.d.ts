export = BleRemotePeripheral;
declare class BleRemotePeripheral {
    constructor(obnizBle: any, address: any);
    obnizBle: any;
    address: any;
    connected: boolean;
    device_type: any;
    address_type: any;
    ble_event_type: any;
    rssi: any;
    adv_data: any;
    scan_resp: any;
    keys: string[];
    _services: any[];
    emitter: import("eventemitter3")<string | symbol>;
    /**
     *
     * @return {String} json value
     */
    toString(): string;
    setParams(dic: any): void;
    advertise_data_rows: any[] | null | undefined;
    analyseAdvertisement(): void;
    searchTypeVal(type: any): any[] | undefined;
    setLocalName(): void;
    localName: string | null | undefined;
    setIBeacon(): void;
    iBeacon: {
        uuid: string;
        major: any;
        minor: any;
        power: any;
        rssi: any;
    } | null | undefined;
    _addServiceUuids(results: any, data: any, bit: any): void;
    advertisementServiceUuids(): any[];
    connect(): void;
    connectWait(): Promise<any>;
    disconnect(): void;
    disconnectWait(): Promise<any>;
    get services(): any[];
    getService(uuid: any): any;
    findService(param: any): any;
    findCharacteristic(param: any): any;
    findDescriptor(param: any): any;
    discoverAllServices(): void;
    discoverAllServicesWait(): Promise<any>;
    discoverAllHandlesWait(): Promise<void>;
    onconnect(): void;
    ondisconnect(): void;
    ondiscoverservice(): void;
    ondiscoverservicefinished(): void;
    ondiscover(): void;
    ondiscoverfinished(): void;
    notifyFromServer(notifyName: any, params: any): void;
    onerror(): void;
}
