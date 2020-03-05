"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
const bleRemoteAttributeAbstract_1 = __importDefault(require("./bleRemoteAttributeAbstract"));
const bleRemoteCharacteristic_1 = __importDefault(require("./bleRemoteCharacteristic"));
/**
 * @category Use as Central
 */
class BleRemoteService extends bleRemoteAttributeAbstract_1.default {
    constructor(obj) {
        super(obj);
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
    get childrenClass() {
        return bleRemoteCharacteristic_1.default;
    }
    /**
     * @ignore
     */
    get childrenName() {
        return "characteristics";
    }
    /**
     * It contains characteristics in a service.
     * It was discovered when connection automatically.
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * var target = {
     *     uuids: ["fff0"],
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     *  if(!peripheral) {
     *     console.log('no such peripheral')
     *     return;
     * }
     * try {
     *   await peripheral.connectWait();
     *   console.log("connected");
     *   var service = peripheral.getService("1800")
     *   for (var c of service.characteristics) {
     *     console.log(c.uuid)
     *   }
     * } catch(e) {
     *   console.error(e);
     * }
     * ```
     */
    get characteristics() {
        return this.children;
    }
    /**
     * @ignore
     * @param param
     */
    addCharacteristic(param) {
        return this.addChild(param);
    }
    /**
     * It returns a characteristic which having specified uuid in a service.
     * Return value is null when not matched.
     *
     * Case is ignored. So aa00 and AA00 are the same.
     *
     * ```javascript
     * // Javascript Example
     *
     * await obniz.ble.initWait();
     * var target = {
     *   uuids: ["fff0"],
     * };
     * var peripheral = await obniz.ble.scan.startOneWait(target);
     * if(!peripheral) {
     *    console.log('no such peripheral')
     *     return;
     * }
     * try {
     *   await peripheral.connectWait();
     *   console.log("connected");
     *   var service = peripheral.getService("1800")
     *   var c = service.getCharacteristic("fff0")
     *   console.log(c.uuid)
     * } catch(e) {
     *   console.error(e);
     * }
     * ```
     * @param uuid
     */
    getCharacteristic(uuid) {
        return this.getChild(uuid);
    }
    /**
     * @ignore
     */
    discoverAllCharacteristics() {
        return this.discoverChildren();
    }
    /**
     * @ignore
     */
    discoverAllCharacteristicsWait() {
        return this.discoverChildrenWait();
    }
    /**
     * @ignore
     */
    discoverChildren() {
        this.parent.obnizBle.centralBindings.discoverCharacteristics(this.peripheral.address, this.uuid);
    }
    /**
     * @ignore
     * @param characteristic
     */
    ondiscover(characteristic) {
        this.ondiscovercharacteristic(characteristic);
    }
    /**
     * @ignore
     * @param characteristics
     */
    ondiscoverfinished(characteristics) {
        this.ondiscovercharacteristicfinished(characteristics);
    }
    /**
     * @ignore
     * @param characteristic
     */
    ondiscovercharacteristic(characteristic) {
    }
    /**
     * @ignore
     * @param characteristics
     */
    ondiscovercharacteristicfinished(characteristics) {
    }
}
exports.default = BleRemoteService;
//# sourceMappingURL=bleRemoteService.js.map