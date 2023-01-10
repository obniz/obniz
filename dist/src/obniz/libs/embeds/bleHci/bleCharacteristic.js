"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BleCharacteristic = void 0;
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
const bleDescriptor_1 = require("./bleDescriptor");
const bleLocalValueAttributeAbstract_1 = require("./bleLocalValueAttributeAbstract");
/**
 * @category Use as Peripheral
 */
class BleCharacteristic extends bleLocalValueAttributeAbstract_1.BleLocalValueAttributeAbstract {
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
    constructor(obj) {
        super(obj);
        this._maxValueSize = null;
        this._updateValueCallback = null;
        if (!Array.isArray(obj.properties) && typeof obj.properties === 'string') {
            this.properties = [obj.properties];
        }
        else {
            this.properties = obj.properties || [];
        }
    }
    /**
     * @ignore
     */
    get parentName() {
        return 'service';
    }
    /**
     * @ignore
     */
    get childrenClass() {
        return bleDescriptor_1.BleDescriptor;
    }
    /**
     * @ignore
     */
    get childrenName() {
        return 'descriptors';
    }
    /**
     * Get descriptor array
     */
    get descriptors() {
        return this.children;
    }
    /**
     * Add new descriptor
     *
     * @param desc
     */
    addDescriptor(desc) {
        return this.addChild(desc);
    }
    /**
     * Get descriptor
     *
     * @param uuid
     */
    getDescriptor(uuid) {
        return this.getChild(uuid);
    }
    /**
     * @ignore
     */
    toJSON() {
        const obj = super.toJSON();
        if (this.properties.length > 0) {
            obj.properties = this.properties;
        }
        // if (this.permissions.length > 0) {
        //   obj.permissions = this.permissions;
        // }
        return obj;
    }
    /**
     * @ignore
     */
    toBufferObj() {
        const obj = super.toBufferObj();
        obj.properties = this.properties;
        obj.secure = [];
        return obj;
    }
    /**
     * Add property
     *
     * @param param
     */
    addProperty(param) {
        if (!this.properties.includes(param)) {
            this.properties.push(param);
        }
    }
    /**
     * Remove property
     *
     * @param param
     */
    removeProperty(param) {
        this.properties = this.properties.filter((elm) => {
            return elm !== param;
        });
    }
    /**
     * @ignore
     * @param param
     */
    addPermission(param) {
        // do nothing.
    }
    /**
     * @ignore
     * @param param
     */
    removePermission(param) {
        // do nothing.
    }
    /**
     * @ignore
     * @param name
     * @param params
     */
    emit(name, ...params) {
        if (name === 'readRequest' || name === 'writeRequest') {
            const result = super.emit(name, ...params);
            if (result) {
                return result;
            }
        }
        switch (name) {
            case 'subscribe':
                this._onSubscribe(...params);
                return true;
            case 'unsubscribe':
                this._onUnsubscribe();
                return true;
            case 'notify':
                this._onNotify();
                return true;
            case 'indicate':
                this._onIndicate();
                return true;
            default:
                throw new Error('unknown emit');
        }
    }
    /**
     * @ignore
     * @param maxValueSize
     * @param updateValueCallback
     * @private
     */
    _onSubscribe(maxValueSize, updateValueCallback) {
        // console.log('_onSubscribe');
        this._maxValueSize = maxValueSize;
        this._updateValueCallback = updateValueCallback;
    }
    /**
     * @ignore
     * @private
     */
    _onUnsubscribe() {
        this._maxValueSize = null;
        this._updateValueCallback = null;
    }
    /**
     * @ignore
     * @private
     */
    _onNotify() {
        // do nothing.
    }
    /**
     * @ignore
     * @private
     */
    _onIndicate() {
        // do nothing.
    }
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
    notify() {
        if (this._updateValueCallback) {
            this._updateValueCallback(Buffer.from(this.data));
        }
    }
}
exports.BleCharacteristic = BleCharacteristic;
