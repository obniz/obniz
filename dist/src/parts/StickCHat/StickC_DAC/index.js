"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MCP4725_1 = __importDefault(require("../../DAConverter/MCP4725"));
class StickC_DAC extends MCP4725_1.default {
    static info() {
        return {
            name: "StickC_DAC",
        };
    }
}
exports.default = StickC_DAC;

//# sourceMappingURL=index.js.map
