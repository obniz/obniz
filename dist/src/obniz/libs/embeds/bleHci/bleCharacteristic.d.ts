/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import { BleDescriptor } from './bleDescriptor';
import { BleLocalValueAttributeAbstract } from './bleLocalValueAttributeAbstract';
import { BleService } from './bleService';
import { BleAttributePropery, BleCharacteristicDefine, BleDescriptorDefine, BleDeviceAddress, UUID } from './bleTypes';
/**
 * @category Use as Peripheral
 */
export declare class BleCharacteristic extends BleLocalValueAttributeAbstract<BleService, BleDescriptor> {
    /**
     * This is a callback function used when characteristic is read by an external device.
     *
     * ```javascript
     * characteristic.onwritefromremote = function(address, newvalue){
     *    console.log("remote address :",address);
     *    console.log("remote data :",newvalue);
     * }
     * ```
     *
     * @param onwritefromremote.address central device address
     * @param onwritefromremote.data written data
     */
    onwritefromremote?: (address: BleDeviceAddress, data: number[]) => void;
    /**
     * This is a callback function used when characteristic is read by an external device.
     *
     * ```javascript
     * characteristic.onreadfromremote = function(address){
     *   console.log("remote address :",address);
     * }
     * ```
     *
     * @param onreadfromremote.address central device address
     */
    onreadfromremote?: (address: BleDeviceAddress) => void;
    /**
     * @ignore
     */
    get parentName(): "service";
    /**
     * @ignore
     */
    get childrenClass(): any;
    /**
     * @ignore
     */
    get childrenName(): "descriptors";
    /**
     * Service instance
     */
    service: BleService;
    /**
     * Get descriptor array
     */
    get descriptors(): BleDescriptor[];
    /**
     * @ignore
     */
    properties: BleAttributePropery[];
    private _maxValueSize;
    private _updateValueCallback;
    /**
     * Create Characteristics
     *
     * ```javascript
     * await obniz.ble.initWait();
     * var characteristic = new obniz.ble.characteristic({
     *      "uuid" : "FFF1",
     *      "properties" : ["read","write"],  // read, write, notify
     *      "data" : [0x0e, 0x00, ...],     //data for dataArray or  text for string
     *      "descriptors" : [{
     *          "uuid" : "2901",   //Characteristic User Description
     *          "text" : "hello world characteristic",    //data for dataArray or  text for string
     *      }]
     * });
     *
     * var service = new obniz.ble.service({
     *                "uuid" : "fff0",
     *                "characteristics" : [ characteristic ]
     * });
     * obniz.ble.peripheral.addService(service);
     * ```
     *
     * @param obj
     */
    constructor(obj: BleCharacteristicDefine);
    /**
     * Add new descriptor
     *
     * @param desc
     */
    addDescriptor(desc: BleDescriptorDefine | BleDescriptor): BleDescriptor;
    /**
     * Get descriptor
     *
     * @param uuid
     */
    getDescriptor(uuid: UUID): BleDescriptor | null;
    /**
     * @ignore
     */
    toJSON(): any;
    /**
     * @ignore
     */
    toBufferObj(): any;
    /**
     * Add property
     *
     * @param param
     */
    addProperty(param: BleAttributePropery): void;
    /**
     * Remove property
     *
     * @param param
     */
    removeProperty(param: BleAttributePropery): void;
    /**
     * @ignore
     * @param param
     */
    addPermission(param: any): void;
    /**
     * @ignore
     * @param param
     */
    removePermission(param: any): void;
    /**
     * @ignore
     * @param name
     * @param params
     */
    emit(name: 'readRequest' | 'writeRequest' | 'subscribe' | 'unsubscribe' | 'notify' | 'indicate', ...params: any): any;
    /**
     * @ignore
     * @param maxValueSize
     * @param updateValueCallback
     * @private
     */
    _onSubscribe(maxValueSize: any, updateValueCallback?: any): void;
    /**
     * @ignore
     * @private
     */
    _onUnsubscribe(): void;
    /**
     * @ignore
     * @private
     */
    _onNotify(): void;
    /**
     * @ignore
     * @private
     */
    _onIndicate(): void;
    /**
     * This sends notify to the connected central.
     *
     * ```javascript
     * var characteristic = new obniz.ble.characteristic({
     *   uuid: 'FFF1',
     *   data: [0x0e, 0x00],
     *   properties : ["read","write","notify"],  // add notify properties
     * });
     *
     *  var service = new obniz.ble.service({
     *   uuid: 'FFF0',
     *   characteristics: [characteristic],
     * });
     * obniz.ble.peripheral.addService(service);
     *
     *
     * // after central connected
     * characteristic.notify();
     * ```
     */
    notify(): void;
}
