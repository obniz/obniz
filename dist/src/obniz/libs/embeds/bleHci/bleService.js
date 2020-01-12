"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleCharacteristic_1 = __importDefault(require("./bleCharacteristic"));
const bleLocalAttributeAbstract_1 = __importDefault(require("./bleLocalAttributeAbstract"));
class BleService extends bleLocalAttributeAbstract_1.default {
    constructor(obj) {
        super(obj);
        this.addCharacteristic = this.addChild;
        this.getCharacteristic = this.getChild;
    }
    get parentName() {
        return "peripheral";
    }
    get childrenName() {
        return "characteristics";
    }
    get childrenClass() {
        return bleCharacteristic_1.default;
    }
    get characteristics() {
        return this.children;
    }
    get advData() {
        return {
            flags: ["general_discoverable_mode", "br_edr_not_supported"],
            serviceUuids: [this.uuid],
        };
    }
    end() {
        this.peripheral.removeService(this.uuid);
    }
    emit(name, ...params) {
    }
    notify(notifyName, params) {
        // nothing
    }
}
exports.default = BleService;

//# sourceMappingURL=bleService.js.map
