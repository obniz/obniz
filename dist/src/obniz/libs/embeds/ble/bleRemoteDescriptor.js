"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleHelper_1 = __importDefault(require("./bleHelper"));
const bleRemoteAttributeAbstract_1 = __importDefault(require("./bleRemoteAttributeAbstract"));
class BleRemoteDescriptor extends bleRemoteAttributeAbstract_1.default {
    constructor(params) {
        super(params);
    }
    get parentName() {
        return "characteristic";
    }
    read() {
        const obj = {
            ble: {
                read_descriptor: {
                    address: this.characteristic.service.peripheral.address,
                    service_uuid: bleHelper_1.default.uuidFilter(this.characteristic.service.uuid),
                    characteristic_uuid: bleHelper_1.default.uuidFilter(this.characteristic.uuid),
                    descriptor_uuid: bleHelper_1.default.uuidFilter(this.uuid),
                },
            },
        };
        this.characteristic.service.peripheral.Obniz.send(obj);
    }
    write(array, needResponse) {
        if (needResponse === undefined) {
            needResponse = true;
        }
        const obj = {
            ble: {
                write_descriptor: {
                    address: this.characteristic.service.peripheral.address,
                    service_uuid: bleHelper_1.default.uuidFilter(this.characteristic.service.uuid),
                    characteristic_uuid: bleHelper_1.default.uuidFilter(this.characteristic.uuid),
                    descriptor_uuid: bleHelper_1.default.uuidFilter(this.uuid),
                    data: array,
                    needResponse,
                },
            },
        };
        this.characteristic.service.peripheral.Obniz.send(obj);
    }
}
exports.default = BleRemoteDescriptor;
//# sourceMappingURL=bleRemoteDescriptor.js.map