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
class HCSR505 {
    constructor() {
        this.keys = ["vcc", "gnd", "signal"];
        this.requiredKeys = ["signal"];
    }
    static info() {
        return {
            name: "HC-SR505",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.io_signal = obniz.getIO(this.params.signal);
        obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.io_signal.input((value) => {
            if (this.onchange) {
                this.onchange(value);
            }
        });
    }
    getWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.io_signal.inputWait();
        });
    }
}
exports.default = HCSR505;

//# sourceMappingURL=index.js.map
