"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleAttributeAbstract_1 = __importDefault(require("./bleAttributeAbstract"));
const bleCharacteristic_1 = __importDefault(require("./bleCharacteristic"));
const bleHelper_1 = __importDefault(require("./bleHelper"));
class BleService extends bleAttributeAbstract_1.default {
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
    get advData() {
        return {
            flags: ["general_discoverable_mode", "br_edr_not_supported"],
            serviceUuids: [this.uuid],
        };
    }
    end() {
        this.peripheral.Obniz.send({
            ble: {
                peripheral: {
                    stop_service: {
                        service_uuid: bleHelper_1.default.uuidFilter(this.uuid),
                    },
                },
            },
        });
        this.peripheral.removeService(this.uuid);
    }
    notify(notifyName, params) {
        // nothing
    }
}
exports.default = BleService;

//# sourceMappingURL=bleService.js.map
