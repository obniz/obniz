"use strict";
/**
 * @packageDocumentation
 * @module Parts..Grove_DistanceSensor
 */
Object.defineProperty(exports, "__esModule", { value: true });
class GP2Y0A21YK0F {
    constructor() {
        this.keys = ["vcc", "gnd", "signal", "grove"];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: "Grove_distanceSensor",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
    }
}
exports.default = GP2Y0A21YK0F;

//# sourceMappingURL=index.js.map
