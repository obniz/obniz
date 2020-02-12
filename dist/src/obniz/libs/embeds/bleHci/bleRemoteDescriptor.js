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
/**
 * @category Use as Central
 */
class BleRemoteDescriptor extends bleRemoteAttributeAbstract_1.default {
    constructor(params) {
        super(params);
    }
    get parentName() {
        return "characteristic";
    }
    read() {
        this.characteristic.service.peripheral.obnizBle.centralBindings.readValue(this.characteristic.service.peripheral.address, this.characteristic.service.uuid, this.characteristic.uuid, this.uuid);
    }
    write(array) {
        this.characteristic.service.peripheral.obnizBle.centralBindings.writeValue(this.characteristic.service.peripheral.address, this.characteristic.service.uuid, this.characteristic.uuid, this.uuid, Buffer.from(array));
    }
}
exports.default = BleRemoteDescriptor;

//# sourceMappingURL=bleRemoteDescriptor.js.map
