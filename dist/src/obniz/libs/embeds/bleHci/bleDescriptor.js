"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleLocalAttributeAbstract_1 = __importDefault(require("./bleLocalAttributeAbstract"));
class BleDescriptor extends bleLocalAttributeAbstract_1.default {
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
}
exports.default = BleDescriptor;

//# sourceMappingURL=bleDescriptor.js.map
