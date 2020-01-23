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
class EARTH {
    constructor() {
        this.keys = ["vcc", "aout", "dout", "gnd"];
        this.requiredKeys = ["aout", "dout"];
    }
    static info() {
        return {
            name: "EARTH",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.ad = obniz.getAD(this.params.aout);
        this.io = obniz.getIO(this.params.dout);
        this.ad.start((value) => {
            this.value = value;
            if (this.onchange) {
                this.onchange(this.value);
            }
        });
    }
    getAnalogHumidityWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ad.getWait();
        });
    }
    getDigitalHumidityWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.io.inputWait();
        });
    }
}
exports.default = EARTH;

//# sourceMappingURL=index.js.map
