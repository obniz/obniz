"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.old
 */
const bleAttributeAbstract_1 = __importDefault(require("./bleAttributeAbstract"));
const bleDescriptor_1 = __importDefault(require("./bleDescriptor"));
const bleHelper_1 = __importDefault(require("./bleHelper"));
/**
 * @category Use as Peripheral
 */
class BleCharacteristic extends bleAttributeAbstract_1.default {
    constructor(obj) {
        super(obj);
        this.addDescriptor = this.addChild;
        this.getDescriptor = this.getChild;
        this.properties = obj.properties || [];
        if (!Array.isArray(this.properties)) {
            this.properties = [this.properties];
        }
        this.permissions = obj.permissions || [];
        if (!Array.isArray(this.permissions)) {
            this.permissions = [this.permissions];
        }
    }
    get parentName() {
        return "service";
    }
    get childrenClass() {
        return bleDescriptor_1.default;
    }
    get childrenName() {
        return "descriptors";
    }
    get descriptors() {
        return this.children;
    }
    toJSON() {
        const obj = super.toJSON();
        if (this.properties.length > 0) {
            obj.properties = this.properties;
        }
        if (this.permissions.length > 0) {
            obj.permissions = this.permissions;
        }
        return obj;
    }
    addProperty(param) {
        if (!this.properties.includes(param)) {
            this.properties.push(param);
        }
    }
    removeProperty(param) {
        this.properties = this.properties.filter((elm) => {
            return elm !== param;
        });
    }
    addPermission(param) {
        if (!this.permissions.includes(param)) {
            this.permissions.push(param);
        }
    }
    removePermission(param) {
        this.permissions = this.permissions.filter((elm) => {
            return elm !== param;
        });
    }
    write(data) {
        this.service.peripheral.Obniz.send({
            ble: {
                peripheral: {
                    write_characteristic: {
                        service_uuid: bleHelper_1.default.uuidFilter(this.service.uuid),
                        characteristic_uuid: bleHelper_1.default.uuidFilter(this.uuid),
                        data,
                    },
                },
            },
        });
    }
    read() {
        this.service.peripheral.Obniz.send({
            ble: {
                peripheral: {
                    read_characteristic: {
                        service_uuid: bleHelper_1.default.uuidFilter(this.service.uuid),
                        characteristic_uuid: bleHelper_1.default.uuidFilter(this.uuid),
                    },
                },
            },
        });
    }
    notify() {
        this.service.peripheral.Obniz.send({
            ble: {
                peripheral: {
                    notify_characteristic: {
                        service_uuid: bleHelper_1.default.uuidFilter(this.service.uuid),
                        characteristic_uuid: bleHelper_1.default.uuidFilter(this.uuid),
                    },
                },
            },
        });
    }
}
exports.default = BleCharacteristic;

//# sourceMappingURL=bleCharacteristic.js.map
