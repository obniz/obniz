"use strict";
/**
 * @packageDocumentation
 * @module Parts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i2cParts_1 = __importDefault(require("./i2cParts"));
class I2cCompassAbstract extends i2cParts_1.default {
    static async calibrateWait() {
        throw new Error('Method not implemented.');
    }
    static async headingWait() {
        throw new Error('Method not implemented.');
    }
    async getWait() {
        const adc = await this.getAdcWait();
        return {
            x: this.calcMag(adc.x),
            y: this.calcMag(adc.y),
            z: this.calcMag(adc.z),
        };
    }
    async getAdcArrayWait() {
        const obj = await this.getAdcWait();
        return [obj.x, obj.y, obj.z];
    }
    async getArrayWait() {
        const obj = await this.getWait();
        return [obj.x, obj.y, obj.z];
    }
    getUnit() {
        return this.sf;
    }
    getRange() {
        return this.range;
    }
    setUnit(new_unit) {
        if (Object.keys(I2cCompassAbstract.unitScales).includes(new_unit)) {
            this.sf = new_unit;
        }
        else {
            throw new Error(`Invalid compass unit. Valid values are ${Object.keys(I2cCompassAbstract.unitScales).join()}`);
        }
    }
    calcMag(data) {
        return ((data * this.so * I2cCompassAbstract.unitScales[this.sf]) /
            I2cCompassAbstract.unitScales[this.defaultUnit]);
    }
}
exports.default = I2cCompassAbstract;
I2cCompassAbstract.unitScales = {
    G: 1,
    uT: 100,
    mT: 0.1,
    T: 0.0001,
    mG: 1000,
    kG: 0.001,
    uG: 1000 * 1000,
};
