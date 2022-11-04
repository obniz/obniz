"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlePeripheral = void 0;
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
const ObnizError_1 = require("../../../ObnizError");
const bleHelper_1 = __importDefault(require("./bleHelper"));
const bleService_1 = require("./bleService");
/**
 * @category Use as Peripheral
 */
class BlePeripheral {
    constructor(obnizBle) {
        this.obnizBle = obnizBle;
        this._services = [];
        this.currentConnectedDeviceAddress = null;
    }
    /**
     * @ignore
     * @private
     */
    _reset() {
        if (this.currentConnectedDeviceAddress) {
            const address = this.currentConnectedDeviceAddress;
            this.currentConnectedDeviceAddress = null;
            this.obnizBle.Obniz._runUserCreatedFunction(this.onconnectionupdates, {
                address,
                status: 'disconnected',
                reason: new ObnizError_1.ObnizOfflineError(),
            });
        }
    }
    /**
     * @ignore
     * @private
     */
    _updateServices() {
        const bufData = this._services.map((e) => e.toBufferObj());
        this.obnizBle.peripheralBindings.setServices(bufData);
    }
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
    addService(service) {
        this.obnizBle.warningIfNotInitialize();
        if (!(service instanceof bleService_1.BleService)) {
            service = new bleService_1.BleService(service);
        }
        this._services.push(service);
        service.peripheral = this;
        this._updateServices();
    }
    /**
     * @ignore
     * @private
     * @param json
     */
    setJson(json) {
        if (json.services) {
            for (const service of json.services) {
                this.addService(service);
            }
        }
    }
    /**
     * Get service by UUID
     *
     * @param uuid
     */
    getService(uuid) {
        uuid = bleHelper_1.default.uuidFilter(uuid);
        const result = this._services
            .filter((element) => {
            return bleHelper_1.default.uuidFilter(element.uuid) === uuid;
        })
            .shift();
        if (!result) {
            return null;
        }
        return result;
    }
    /**
     * Terminate service by UUID
     *
     * @param uuid
     */
    removeService(uuid) {
        this._services = this._services.filter((element) => {
            return bleHelper_1.default.uuidFilter(element.uuid) !== uuid;
        });
        this._updateServices();
    }
    /**
     * @ignore
     */
    stopAllService() {
        this._services = [];
        this._updateServices();
    }
    /**
     * @ignore
     */
    toJSON() {
        return {
            services: this._services,
        };
    }
    /**
     * @ignore
     * @param param
     */
    findCharacteristic(param) {
        const serviceUuid = bleHelper_1.default.uuidFilter(param.service_uuid);
        const characteristicUuid = bleHelper_1.default.uuidFilter(param.characteristic_uuid);
        const s = this.getService(serviceUuid);
        if (s) {
            return s.getCharacteristic(characteristicUuid);
        }
        return null;
    }
    /**
     * @ignore
     * @param param
     */
    findDescriptor(param) {
        const descriptorUuid = bleHelper_1.default.uuidFilter(param.descriptor_uuid);
        const c = this.findCharacteristic(param);
        if (c) {
            return c.getDescriptor(descriptorUuid);
        }
        return null;
    }
    /**
     * This ends all the peripheral service
     *
     * ```javascript
     * obniz.ble.peripheral.addService(setting);
     * obniz.ble.peripheral.end();
     * ```
     */
    end() {
        this.stopAllService();
    }
    /**
     * @ignore
     * @param error
     */
    onerror(error) {
        // do nothing.
    }
}
exports.BlePeripheral = BlePeripheral;
