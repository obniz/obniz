"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
const bleHelper_1 = __importDefault(require("./bleHelper"));
const bleService_1 = __importDefault(require("./bleService"));
/**
 * @category Use as Peripheral
 */
class BlePeripheral {
    constructor(obnizBle) {
        this.obnizBle = obnizBle;
        this._services = [];
        this.currentConnectedDeviceAddress = null;
    }
    _updateServices() {
        const bufData = this._services.map((e) => e.toBufferObj());
        this.obnizBle.peripheralBindings.setServices(bufData);
    }
    addService(obj) {
        this.obnizBle.warningIfNotInitialize();
        if (!(obj instanceof bleService_1.default)) {
            obj = new bleService_1.default(obj);
        }
        this._services.push(obj);
        obj.peripheral = this;
        this._updateServices();
    }
    setJson(json) {
        if (json.services) {
            for (const service of json.services) {
                this.addService(service);
            }
        }
    }
    getService(uuid) {
        uuid = bleHelper_1.default.uuidFilter(uuid);
        return this._services
            .filter((element) => {
            return bleHelper_1.default.uuidFilter(element.uuid) === uuid;
        })
            .shift();
    }
    removeService(uuid) {
        this._services = this._services.filter((element) => {
            return bleHelper_1.default.uuidFilter(element.uuid) !== uuid;
        });
        this._updateServices();
    }
    stopAllService() {
        this._services = [];
        this._updateServices();
    }
    toJSON() {
        return {
            services: this._services,
        };
    }
    findCharacteristic(param) {
        const serviceUuid = bleHelper_1.default.uuidFilter(param.service_uuid);
        const characteristicUuid = bleHelper_1.default.uuidFilter(param.characteristic_uuid);
        const s = this.getService(serviceUuid);
        if (s) {
            return s.getCharacteristic(characteristicUuid);
        }
        return null;
    }
    findDescriptor(param) {
        const descriptorUuid = bleHelper_1.default.uuidFilter(param.descriptor_uuid);
        const c = this.findCharacteristic(param);
        if (c) {
            return c.getDescriptor(descriptorUuid);
        }
        return null;
    }
    end() {
        this.stopAllService();
    }
    onconnectionupdates(param) {
    }
    onerror(error) {
    }
}
exports.default = BlePeripheral;

//# sourceMappingURL=blePeripheral.js.map
