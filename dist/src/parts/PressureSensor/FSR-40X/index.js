"use strict";
// Todo: add weight and calc pressure(kg)
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
class FSR40X {
    constructor() {
        this.pressure = 0;
        this.keys = ["pin0", "pin1"];
        this.requiredKeys = ["pin0", "pin1"];
    }
    static info() {
        return {
            name: "FSR40X",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.io_pwr = obniz.getIO(this.params.pin0);
        this.ad = obniz.getAD(this.params.pin1);
        this.io_pwr.drive("5v");
        this.io_pwr.output(true);
        this.ad.start((value) => {
            const pressure = value * 100;
            this.pressure = pressure;
            if (this.onchange) {
                this.onchange(this.pressure);
            }
        });
    }
    getWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this.ad.getWait();
            const pressure = value * 100;
            this.pressure = pressure;
            return this.pressure;
        });
    }
}
exports.default = FSR40X;

//# sourceMappingURL=index.js.map
