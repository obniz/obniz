"use strict";
/**
 * @packageDocumentation
 * @module Parts..Grove_DistanceSensor
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Grove_DistanceSensor {
    constructor() {
        this._unit = "mm";
        this.keys = ["vcc", "gnd", "signal", "grove"];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: "Grove_DistanceSensor",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        if (this.params.grove) {
            const groveAd = this.params.grove.getAnalog();
            this.ad = groveAd.primary;
            console.log(this.ad);
        }
        else {
            this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
            this.ad = obniz.getAD(this.params.signal);
        }
    }
    start(callback) {
        this.ad.start((val) => {
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
        return new Promise(async (resolve, reject) => {
            try {
                const val = await this.ad.getWait();
                const distance = this._volt2distance(val);
                resolve(distance);
            }
            catch (e) {
                reject(e);
            }
        });
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
exports.default = Grove_DistanceSensor;

//# sourceMappingURL=index.js.map
