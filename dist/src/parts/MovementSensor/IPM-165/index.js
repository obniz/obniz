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
class IPM_165 {
    constructor() {
        this.keys = ["signal", "vcc", "gnd"];
        this.requiredKeys = ["signal"];
    }
    static info() {
        return {
            name: "IPM-165",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.signal = this.obniz.getAD(this.params.signal);
        this.signal.start((value) => {
            if (this.onchange) {
                this.onchange(value);
            }
        });
    }
    getWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.signal.getWait();
        });
    }
}
exports.default = IPM_165;

//# sourceMappingURL=index.js.map
