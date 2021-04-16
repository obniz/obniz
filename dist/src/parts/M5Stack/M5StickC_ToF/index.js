"use strict";
/**
 * @packageDocumentation
 * @module Parts.M5StickC_ToF
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const VL53L0X_1 = __importDefault(require("../../DistanceSensor/VL53L0X"));
class M5StickC_ToF extends VL53L0X_1.default {
    static info() {
        return {
            name: 'M5StickC_ToF',
        };
    }
    wired(obniz) {
        if (!this.obniz.isValidIO(this.params.sda) &&
            !this.obniz.isValidIO(this.params.scl) &&
            !this.params.i2c) {
            if (this.obniz.hasExtraInterface('m5stickc_hat')) {
                const hatI2c = this.obniz.getExtraInterface('m5stickc_hat').i2c;
                this.params.sda = hatI2c.sda;
                this.params.scl = hatI2c.scl;
            }
            else {
                throw new Error("Cannot find m5stickc hat interface. Please set param 'sda'/'scl' or 'i2c'");
            }
        }
        super.wired(obniz);
    }
}
exports.default = M5StickC_ToF;
