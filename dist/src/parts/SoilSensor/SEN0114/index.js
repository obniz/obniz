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
class SEN0114 {
    constructor() {
        this.keys = ["vcc", "output", "gnd"];
        this.requiredKeys = ["output"];
    }
    static info() {
        return {
            name: "SEN0114",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.ad = obniz.getAD(this.params.output);
        this.ad.start((value) => {
            this.value = value;
            if (this.onchange) {
                this.onchange(this.value);
            }
        });
    }
    getHumidityWait() {
        return __awaiter(this, void 0, void 0, function* () {
            this.value = yield this.ad.getWait();
            return this.value;
        });
    }
}
exports.default = SEN0114;

//# sourceMappingURL=index.js.map
