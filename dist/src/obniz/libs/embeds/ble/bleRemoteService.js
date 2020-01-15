"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleHelper_1 = __importDefault(require("./bleHelper"));
const bleRemoteAttributeAbstract_1 = __importDefault(require("./bleRemoteAttributeAbstract"));
const bleRemoteCharacteristic_1 = __importDefault(require("./bleRemoteCharacteristic"));
class BleRemoteService extends bleRemoteAttributeAbstract_1.default {
    constructor(obj) {
        super(obj);
    }
    get parentName() {
        return "peripheral";
    }
    get childrenClass() {
        return bleRemoteCharacteristic_1.default;
    }
    get childrenName() {
        return "characteristics";
    }
    get characteristics() {
        return this.children;
    }
    addCharacteristic(params) {
        return this.addChild(params);
    }
    getCharacteristic(params) {
        return this.getChild(params);
    }
    discoverAllCharacteristics() {
        return this.discoverChildren();
    }
    discoverAllCharacteristicsWait() {
        return this.discoverChildrenWait();
    }
    discoverChildren() {
        const obj = {
            ble: {
                get_characteristics: {
                    address: this.peripheral.address,
                    service_uuid: bleHelper_1.default.uuidFilter(this.uuid),
                },
            },
        };
        this.parent.Obniz.send(obj);
    }
    ondiscover(characteristic) {
        this.ondiscovercharacteristic(characteristic);
    }
    ondiscoverfinished(characteristics) {
        this.ondiscovercharacteristicfinished(characteristics);
    }
    ondiscovercharacteristic(characteristic) {
    }
    ondiscovercharacteristicfinished(characteristics) {
    }
}
exports.default = BleRemoteService;
//# sourceMappingURL=bleRemoteService.js.map