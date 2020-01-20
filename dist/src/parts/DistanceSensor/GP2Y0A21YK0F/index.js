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
class GP2Y0A21YK0F {
    constructor() {
        this.displayIoNames = {
            vcc: "vcc",
            gnd: "gnd",
            signal: "signal",
        };
        this._unit = "mm";
        this.keys = ["vcc", "gnd", "signal"];
        this.requiredKeys = ["signal"];
    }
    static info() {
        return {
            name: "GP2Y0A21YK0F",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        const io_signal = obniz.getIO(this.params.signal);
        io_signal.end();
        this.ad_signal = obniz.getAD(this.params.signal);
    }
    start(callback) {
        this.ad_signal.start((val) => {
            const distance = this._volt2distance(val);
            if (typeof callback === "function") {
                callback(distance);
            }
        });
    }
    _volt2distance(val) {
        if (val <= 0) {
            val = 0.001;
        }
        let distance = 19988.34 * Math.pow((val / 5.0) * 1024, -1.25214) * 10;
        if (this._unit === "mm") {
            distance = Math.floor(distance * 10) / 10;
        }
        else {
            distance *= 0.0393701;
            distance = Math.floor(distance * 1000) / 1000;
        }
        return distance;
    }
    getWait() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const val = yield this.ad_signal.getWait();
                const distance = this._volt2distance(val);
                resolve(distance);
            }
            catch (e) {
                reject(e);
            }
        }));
    }
    unit(unit) {
        if (unit === "mm") {
            this._unit = "mm";
        }
        else if (unit === "inch") {
            this._unit = "inch";
        }
        else {
            throw new Error("unknown unit " + unit);
        }
    }
}
exports.default = GP2Y0A21YK0F;

//# sourceMappingURL=index.js.map
