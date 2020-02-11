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
/**
 * @category Parts
 */
class CT10 {
    constructor() {
        this.isNear = null;
        this.onchange = null;
        this.keys = ["signal", "gnd", "vcc"];
        this.requiredKeys = ["signal"];
        this.onChangeForStateWait = () => {
        };
    }
    static info() {
        return {
            name: "CT10",
        };
    }
    wired(obniz) {
        this.io_signal = obniz.getIO(this.params.signal);
        if (obniz.isValidIO(this.params.vcc)) {
            this.io_vcc = obniz.getIO(this.params.vcc);
            this.io_vcc.output(true);
        }
        if (obniz.isValidIO(this.params.gnd)) {
            this.io_supply = obniz.getIO(this.params.gnd);
            this.io_supply.output(false);
        }
        this.io_signal.pull("0v");
        this.io_signal.input((value) => {
            this.isNear = value;
            if (this.onchange) {
                this.onchange(value);
            }
            this.onChangeForStateWait(value);
        });
    }
    isNearWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.io_signal.inputWait();
        });
    }
    stateWait(isNear) {
        return new Promise((resolve) => {
            this.onChangeForStateWait = (near) => {
                if (isNear === near) {
                    this.onChangeForStateWait = () => {
                    };
                    resolve();
                }
            };
        });
    }
}
exports.default = CT10;

//# sourceMappingURL=index.js.map
