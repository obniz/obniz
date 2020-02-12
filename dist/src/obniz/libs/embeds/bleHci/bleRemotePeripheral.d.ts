/**
 * @category Use as Central
 */
export default class BleRemotePeripheral {
    obnizBle: any;
    address: any;
    connected: any;
    device_type: any;
    address_type: any;
    ble_event_type: any;
    rssi: any;
    adv_data: any;
    scan_resp: any;
    keys: any;
    _services: any;
    emitter: any;
    advertise_data_rows: any;
    localName: any;
    iBeacon: any;
    constructor(obnizBle: any, address: any);
    /**
     *
     * @return {String} json value
     */
    toString(): string;
    setParams(dic: any): void;
    analyseAdvertisement(): void;
    searchTypeVal(type: any): any;
    setLocalName(): void;
    setIBeacon(): void;
    _addServiceUuids(results: any, data: any, bit: any): void;
    advertisementServiceUuids(): any;
    connect(): void;
    connectWait(): Promise<unknown>;
    disconnect(): void;
    disconnectWait(): Promise<unknown>;
    get services(): any;
    getService(uuid: any): any;
    findService(param: any): any;
    findCharacteristic(param: any): any;
    findDescriptor(param: any): any;
    discoverAllServices(): void;
    discoverAllServicesWait(): Promise<unknown>;
    discoverAllHandlesWait(): Promise<void>;
    onconnect(): void;
    ondisconnect(): void;
    ondiscoverservice(child: any): void;
    ondiscoverservicefinished(children: any): void;
    ondiscover(): void;
    ondiscoverfinished(): void;
    notifyFromServer(notifyName: any, params: any): void;
    onerror(): void;
}
