"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.old
 */
const bleHelper_1 = __importDefault(require("./bleHelper"));
const bleService_1 = __importDefault(require("./bleService"));
/**
 * @category Use as Peripheral
 */
class BlePeripheral {
    constructor(Obniz) {
        this.Obniz = Obniz;
        this._services = [];
    }
    get services() {
        return this._services;
    }
    addService(obj) {
        if (!(obj instanceof bleService_1.default)) {
            obj = new bleService_1.default(obj);
        }
        this._services.push(obj);
        obj.peripheral = this;
        this.Obniz.send({ ble: { peripheral: { services: [obj] } } });
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
    }
    stopAllService() {
        this.Obniz.send({
            ble: {
                peripheral: null,
            },
        });
        this._services = [];
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
        this.Obniz.send({ ble: { peripheral: null } });
    }
    onconnectionupdates() {
    }
    onerror() {
    }
}
exports.default = BlePeripheral;

//# sourceMappingURL=blePeripheral.js.map
