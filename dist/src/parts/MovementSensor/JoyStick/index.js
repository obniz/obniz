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
class JoyStick {
    constructor() {
        this.keys = ["sw", "y", "x", "vcc", "gnd", "i2c"];
        this.requiredKeys = ["sw", "y", "x"];
        this.pins = this.keys || ["sw", "y", "x", "vcc", "gnd"];
        this.pinname = { sw: "sw12" };
        this.shortName = "joyS";
    }
    static info() {
        return {
            name: "JoyStick",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.io_sig_sw = obniz.getIO(this.params.sw);
        this.ad_x = obniz.getAD(this.params.x);
        this.ad_y = obniz.getAD(this.params.y);
        this.io_sig_sw.pull("5v");
        const self = this;
        this.ad_x.start((value) => {
            self.positionX = value / 5.0;
            if (self.onchangex) {
                self.onchangex(self.positionX * 2 - 1);
            }
        });
        this.ad_y.start((value) => {
            self.positionY = value / 5.0;
            if (self.onchangey) {
                self.onchangey(self.positionY * 2 - 1);
            }
        });
        this.io_sig_sw.input((value) => {
            self.isPressed = value === false;
            if (self.onchangesw) {
                self.onchangesw(value === false);
            }
        });
    }
    isPressedWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.io_sig_sw.inputWait();
            return ret === false;
        });
    }
    getXWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this.ad_x.getWait();
            this.positionX = value / 5.0;
            return this.positionX * 2 - 1;
        });
    }
    getYWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this.ad_y.getWait();
            this.positionY = value / 5.0;
            return this.positionY * 2 - 1;
        });
    }
}
exports.default = JoyStick;

//# sourceMappingURL=index.js.map
