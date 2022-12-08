"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BleService = void 0;
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
const bleCharacteristic_1 = require("./bleCharacteristic");
const bleLocalAttributeAbstract_1 = require("./bleLocalAttributeAbstract");
/**
 * @category Use as Peripheral
 */
class BleService extends bleLocalAttributeAbstract_1.BleLocalAttributeAbstract {
    constructor(obj) {
        super(obj);
        this.addCharacteristic = this.addChild;
        this.getCharacteristic = this.getChild;
    }
    /**
     * Add new Characteristic
     *
     * @param child
     */
    addCharacteristic(child) {
        return this.addChild(child);
    }
    /**
     * Get Characteristic
     *
     * @param uuid
     */
    getCharacteristic(uuid) {
        return this.getChild(uuid);
    }
    /**
     * @ignore
     */
    get parentName() {
        return 'peripheral';
    }
    /**
     * @ignore
     */
    get childrenName() {
        return 'characteristics';
    }
    /**
     * @ignore
     */
    get childrenClass() {
        return bleCharacteristic_1.BleCharacteristic;
    }
    get characteristics() {
        return this.children;
    }
    /**
     * advertisment object for [[BleAdvertisement.setAdvData]]
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * var service = new obniz.ble.service({ uuid : "1234" });
     * var characteristic = new obniz.ble.characteristic({ uuid : "7777", data: [1, 2, 3]});
     * service.addCharacteristic(characteristic);
     * obniz.ble.peripheral.addService(service);
     *
     * obniz.ble.advertisement.setAdvData(service.advData);
     * obniz.ble.advertisement.setScanRespData({
     *    localName : "obniz BLE",
     * });
     * obniz.ble.advertisement.start();
     * ```
     */
    get advData() {
        return {
            flags: ['general_discoverable_mode', 'br_edr_not_supported'],
            serviceUuids: [this.uuid],
        };
    }
    /**
     * Terminate created service
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait();
     * var service = new obniz.ble.service({ uuid : "1234" });
     * var characteristic = new obniz.ble.characteristic({ uuid : "7777", data: [1, 2, 3]});
     * service.addCharacteristic(characteristic);
     * obniz.ble.peripheral.addService(service);
     *
     * service.end();
     * ```
     */
    end() {
        this.peripheral.removeService(this.uuid);
    }
    /**
     * @ignore
     * @param notifyName
     * @param params
     */
    notify(notifyName, params) {
        // nothing
    }
}
exports.BleService = BleService;
