"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BleRemoteService = void 0;
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
const bleHelper_1 = __importDefault(require("./bleHelper"));
const bleRemoteAttributeAbstract_1 = require("./bleRemoteAttributeAbstract");
const bleRemoteCharacteristic_1 = require("./bleRemoteCharacteristic");
/**
 * @category Use as Central
 */
class BleRemoteService extends bleRemoteAttributeAbstract_1.BleRemoteAttributeAbstract {
    constructor(obj) {
        super(obj);
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
    get childrenClass() {
        return bleRemoteCharacteristic_1.BleRemoteCharacteristic;
    }
    /**
     * @ignore
     */
    get childrenName() {
        return 'characteristics';
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
     *
     * @param uuid
     */
    getCharacteristic(uuid) {
        return this.getChild(uuid);
    }
    /**
     * @ignore
     * @deprecated  replaced by {@link #discoverAllCharacteristicsWait()}
     */
    discoverAllCharacteristics() {
        // noinspection JSIgnoredPromiseFromCall
        this.discoverAllCharacteristicsWait(); // background
    }
    /**
     * Discover services.
     *
     * If connect setting param 'autoDiscovery' is true(default),
     * services are automatically disvocer on connection established.
     *
     *
     * ```javascript
     * // Javascript Example
     * await obniz.ble.initWait({});
     * obniz.ble.scan.onfind = function(peripheral){
     * if(peripheral.localName == "my peripheral"){
     *      peripheral.onconnect = async function(){
     *          console.log("success");
     *          await peripheral.discoverAllServicesWait(); //manually discover
     *          let service = peripheral.getService("1800");
     *          await service.discoverAllCharacteristicsWait(); //manually discover
     *          let characteristics = service.getCharacteristic("ff00")
     *      }
     *      peripheral.connect({autoDiscovery:false});
     *     }
     * }
     * await obniz.ble.scan.startWait();
     * ```
     */
    async discoverAllCharacteristicsWait() {
        const chars = await this.parent.obnizBle.centralBindings.discoverCharacteristicsWait(this.peripheral.address, this.uuid);
        for (const char of chars) {
            const uuid = char.uuid;
            const properties = char.properties.map((e) => bleHelper_1.default.toSnakeCase(e));
            let child = this.getChild(uuid);
            if (!child) {
                child = this.addChild({ uuid });
            }
            child.discoverdOnRemote = true;
            child.properties = properties || [];
            this.ondiscover(child);
        }
        return this.characteristics.filter((elm) => {
            return elm.discoverdOnRemote;
        });
    }
    /**
     * @ignore
     * @param characteristic
     */
    ondiscover(characteristic) {
        this._runUserCreatedFunction(this.ondiscovercharacteristic, characteristic);
    }
    /**
     * @ignore
     * @param characteristics
     */
    ondiscoverfinished(characteristics) {
        this._runUserCreatedFunction(this.ondiscovercharacteristicfinished, characteristics);
    }
    /**
     * @ignore
     * @param characteristic
     */
    ondiscovercharacteristic(characteristic) {
        // do nothing.
    }
    /**
     * @ignore
     * @param characteristics
     */
    ondiscovercharacteristicfinished(characteristics) {
        // do nothing.
    }
    /**
     * @ignore
     */
    async readWait() {
        throw new Error('cannot read service');
    }
    /**
     * @ignore
     */
    async writeWait() {
        throw new Error('cannot write service');
    }
}
exports.BleRemoteService = BleRemoteService;
