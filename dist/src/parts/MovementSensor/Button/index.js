"use strict";
/**
 * @packageDocumentation
 * @module Parts.Button
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
class Button {
    constructor() {
        this.isPressed = null;
        this.onchange = null;
        this.keys = ["signal", "gnd", "pull"];
        this.requiredKeys = ["signal"];
        this.onChangeForStateWait = () => {
        };
    }
    static info() {
        return {
            name: "Button",
        };
    }
    wired(obniz) {
        this.io_signal = obniz.getIO(this.params.signal);
        if (obniz.isValidIO(this.params.gnd)) {
            this.io_supply = obniz.getIO(this.params.gnd);
            this.io_supply.output(false);
        }
        // start input
        if (this.params.pull === "3v") {
            this.io_signal.pull("3v");
        }
        else if (this.params.pull === "0v") {
            this.io_signal.pull("0v");
        }
        else {
            this.io_signal.pull("5v");
        }
        this.io_signal.input((value) => {
            this.isPressed = value === false;
            if (this.onchange) {
                this.onchange(value === false);
            }
            this.onChangeForStateWait(value === false);
        });
    }
    isPressedWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.io_signal.inputWait();
            return ret === false;
        });
    }
    stateWait(isPressed) {
        return new Promise((resolve, reject) => {
            this.onChangeForStateWait = (pressed) => {
                if (isPressed === pressed) {
                    this.onChangeForStateWait = () => {
                    };
                    resolve();
                }
            };
        });
    }
}
exports.default = Button;

//# sourceMappingURL=index.js.map
