"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const VL53L0X_1 = __importDefault(require("../../DistanceSensor/VL53L0X"));
class StickC_ToF extends VL53L0X_1.default {
    static info() {
        return {
            name: "StickC_ToF",
        };
    }
}
exports.default = StickC_ToF;

//# sourceMappingURL=index.js.map
