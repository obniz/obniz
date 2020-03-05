"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i2cParts_1 = __importDefault(require("./i2cParts"));
class I2cCompassAbstract extends i2cParts_1.default {
    static calibrateWait() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
    static headingWait() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Method not implemented.");
        });
    }
    getWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const adc = yield this.getAdcWait();
            return {
                x: this.calcMag(adc.x),
                y: this.calcMag(adc.y),
                z: this.calcMag(adc.z),
            };
        });
    }
    getAdcArrayWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = yield this.getAdcWait();
            return [obj.x, obj.y, obj.z];
        });
    }
    getArrayWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = yield this.getWait();
            return [obj.x, obj.y, obj.z];
        });
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
        return data * this.so * I2cCompassAbstract.unitScales[this.sf] / I2cCompassAbstract.unitScales[this.defaultUnit];
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

//# sourceMappingURL=i2cCompass.js.map
