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
Object.defineProperty(exports, "__esModule", { value: true });
class M5Stack_JoyStick {
    constructor() {
        this.requiredKeys = ["sda", "scl"];
        this.keys = ["vcc", "gnd", "sda", "scl", "i2c"];
    }
    static info() {
        return {
            name: "M5Stack_JoyStick",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.obniz.wait(100); // wait for booting of MEGA328
        this.params.mode = "master";
        this.params.clock = 400000;
        this.params.pull = "5v";
        this.i2c = this.obniz.getI2CWithConfig(this.params);
    }
    getXWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.i2c.readWait(0x52, 3);
            return ret[0];
        });
    }
    getYWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.i2c.readWait(0x52, 3);
            return ret[1];
        });
    }
    isPressedWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.i2c.readWait(0x52, 3);
            return Boolean(ret[2]);
        });
    }
}
exports.default = M5Stack_JoyStick;

//# sourceMappingURL=index.js.map
