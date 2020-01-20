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
class ADT7410 {
    constructor() {
        this.keys = ["vcc", "gnd", "sda", "scl", "addressMode"];
        this.requiredKeys = ["addressMode"];
    }
    static info() {
        return {
            name: "ADT7410",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        if (this.params.addressMode === 8) {
            this.address = 0x48;
        }
        else if (this.params.addressMode === 9) {
            this.address = 0x49;
        }
        else {
            throw new Error(`please specify address. 8 or 9`);
        }
        this.params.clock = 400000;
        this.params.pull = "5v";
        this.params.mode = "master";
        this.i2c = obniz.getI2CWithConfig(this.params);
    }
    getTempWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.i2c.readWait(this.address, 2);
            let tempBin = ret[0] << 8;
            tempBin |= ret[1];
            tempBin = tempBin >> 3;
            if (tempBin & 0x1000) {
                tempBin = tempBin - 8192;
            }
            return tempBin / 16;
        });
    }
}
exports.default = ADT7410;

//# sourceMappingURL=index.js.map
