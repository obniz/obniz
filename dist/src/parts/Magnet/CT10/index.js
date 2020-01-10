"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class CT10 {
    static info() {
        return {
            name: "CT10",
        };
    }
    constructor() {
        this.keys = ["signal", "gnd", "vcc"];
        this.requiredKeys = ["signal"];
        this.onChangeForStateWait = () => {
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
        const self = this;
        this.io_signal.input((value) => {
            self.isNear = value;
            if (self.onchange) {
                self.onchange(value);
            }
            self.onChangeForStateWait(value);
        });
    }
    isNearWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.io_signal.inputWait();
            return ret;
        });
    }
    stateWait(isNear) {
        return new Promise((resolve, reject) => {
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