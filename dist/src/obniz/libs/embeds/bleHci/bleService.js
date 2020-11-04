"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
const bleCharacteristic_1 = __importDefault(require("./bleCharacteristic"));
const bleLocalAttributeAbstract_1 = __importDefault(require("./bleLocalAttributeAbstract"));
/**
 * @category Use as Peripheral
 */
class BleService extends bleLocalAttributeAbstract_1.default {
    constructor(obj) {
        super(obj);
        this.addCharacteristic = this.addChild;
        this.getCharacteristic = this.getChild;
    }
    /**
     * Add new Characteristic
     * @param child
     */
    addCharacteristic(child) {
        return this.addChild(child);
    }
    /**
     * Get Characteristic
     * @param uuid
     */
    getCharacteristic(uuid) {
        return this.getChild(uuid);
    }
    /**
     * @ignore
     */
    get parentName() {
        return "peripheral";
    }
    /**
     * @ignore
     */
    get childrenName() {
        return "characteristics";
    }
    /**
     * @ignore
     */
    get childrenClass() {
        return bleCharacteristic_1.default;
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
            flags: ["general_discoverable_mode", "br_edr_not_supported"],
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
exports.default = BleService;
