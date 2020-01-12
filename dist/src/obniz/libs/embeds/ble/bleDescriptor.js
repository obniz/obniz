"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleAttributeAbstract_1 = __importDefault(require("./bleAttributeAbstract"));
const bleHelper_1 = __importDefault(require("./bleHelper"));
class BleDescriptor extends bleAttributeAbstract_1.default {
    constructor(obj) {
        super(obj);
        this.permissions = obj.permissions || [];
        if (!Array.isArray(this.permissions)) {
            this.permissions = [this.permissions];
        }
    }
    get parentName() {
        return "characteristic";
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
    toJSON() {
        const obj = super.toJSON();
        if (this.permissions.length > 0) {
            obj.permissions = this.permissions;
        }
        return obj;
    }
    write(dataArray) {
        this.characteristic.service.peripheral.Obniz.send({
            ble: {
                peripheral: {
                    write_descriptor: {
                        service_uuid: bleHelper_1.default.uuidFilter(this.characteristic.service.uuid),
                        characteristic_uuid: bleHelper_1.default.uuidFilter(this.characteristic.uuid),
                        descriptor_uuid: this.uuid,
                        data: dataArray,
                    },
                },
            },
        });
    }
    read() {
        this.characteristic.service.peripheral.Obniz.send({
            ble: {
                peripheral: {
                    read_descriptor: {
                        service_uuid: bleHelper_1.default.uuidFilter(this.characteristic.service.uuid),
                        characteristic_uuid: bleHelper_1.default.uuidFilter(this.characteristic.uuid),
                        descriptor_uuid: this.uuid,
                    },
                },
            },
        });
    }
}
exports.default = BleDescriptor;
//# sourceMappingURL=bleDescriptor.js.map