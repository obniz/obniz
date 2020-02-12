"use strict";
/**
 * @packageDocumentation
 * @module Parts
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @category Parts
 */
class HMC5883L {
    constructor() {
        this.address = {
            device: 0x1e,
            reset: [0x02, 0x00],
            xMSB: [0x03],
        };
        this.keys = ["gnd", "sda", "scl", "i2c"];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: "HMC5883L",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(null, this.params.gnd, "3v");
        this.params.clock = 100000;
        this.params.pull = "3v";
        this.params.mode = "master";
        this.i2c = obniz.getI2CWithConfig(this.params);
        this.obniz.wait(500);
    }
    init() {
        this.i2c.write(this.address.device, this.address.reset);
        this.obniz.wait(500);
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this.address.device, this.address.xMSB);
            const readed = yield this.i2c.readWait(this.address.device, 2 * 3);
            const obj = {};
            const keys = ["x", "y", "z"];
            for (let i = 0; i < 3; i++) {
                let val = (readed[i * 2] << 8) | readed[i * 2 + 1];
                if (val & 0x8000) {
                    val = val - 65536;
                }
                obj[keys[i]] = val;
            }
            return obj;
        });
    }
}
exports.default = HMC5883L;

//# sourceMappingURL=index.js.map
