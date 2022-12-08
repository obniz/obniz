import { ObnizBLE } from './ble';
import { BleService } from './bleService';
import { BleDeviceAddress, BleServiceDefine, UUID } from './bleTypes';
export declare type BleConnectionState = 'connected' | 'disconnected';
export interface BleConnectionUpdateParam {
    address: BleDeviceAddress;
    status: BleConnectionState;
    reason?: string | Error;
}
/**
 * @category Use as Peripheral
 */
export declare class BlePeripheral {
    /**
     * Current connected device address
     */
    currentConnectedDeviceAddress: BleDeviceAddress | null;
    /**
     * This is a callback function used when an external device gets connected or disconnected.
     *
     * ```javascript
     * await obniz.ble.initWait();
     * obniz.ble.peripheral.onconnectionupdates = function(data){
     *   console.log("remote device ", data.address, data.status)
     * };
     * ```
     *
     */
    onconnectionupdates?: (param: BleConnectionUpdateParam) => void;
    private obnizBle;
    private _services;
    constructor(obnizBle: ObnizBLE);
    /**
     * @ignore
     * @private
     */
    _reset(): void;
    /**
     * @ignore
     * @private
     */
    _updateServices(): void;
    /**
     * This starts a service as peripheral.
     *
     *
     * ```javascript
     *
     * await obniz.ble.initWait();
     * // Service without characteristics
     * var service1 = new obniz.ble.service({"uuid" : "fff0"});
     * obniz.ble.peripheral.addService(service1);
     *
     * // Service with characteristics/descriptor
     * var service2 = new obniz.ble.service({"uuid" : "fff0"});
     * var characteristic = new obniz.ble.characteristic({"uuid" : "FFF1", "text": "Hi"});
     * var descriptor = new obniz.ble.descriptor({"uuid" : "2901", "text" : "hello world characteristic"});
     *
     * service2.addCharacteristic(characteristic);
     * characteristic.addDescriptor(descriptor);
     *
     * obniz.ble.peripheral.addService(service2); // call this after all descriptors and characteristics added to service.
     * ```
     *
     * @param service
     */
    addService(service: BleServiceDefine | BleService): void;
    /**
     * @ignore
     * @private
     * @param json
     */
    setJson(json: any): void;
    /**
     * Get service by UUID
     *
     * @param uuid
     */
    getService(uuid: UUID): BleService | null;
    /**
     * Terminate service by UUID
     *
     * @param uuid
     */
    removeService(uuid: UUID): void;
    /**
     * @ignore
     */
    stopAllService(): void;
    /**
     * @ignore
     */
    toJSON(): {
        services: BleService[];
    };
    /**
     * @ignore
     * @param param
     */
    findCharacteristic(param: any): any;
    /**
     * @ignore
     * @param param
     */
    findDescriptor(param: any): any;
    /**
     * This ends all the peripheral service
     *
     * ```javascript
     * obniz.ble.peripheral.addService(setting);
     * obniz.ble.peripheral.end();
     * ```
     */
    end(): void;
    /**
     * @ignore
     * @param error
     */
    onerror(error: any): void;
}
