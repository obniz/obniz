"use strict";
/**
 * @packageDocumentation
 * @module Parts..Grove_DistanceSensor
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GP2Y0A21YK0F_1 = __importDefault(require("../../../parts/DistanceSensor/GP2Y0A21YK0F"));
class Grove_DistanceSensor extends GP2Y0A21YK0F_1.default {
    static info() {
        return {
            name: 'Grove_DistanceSensor',
        };
    }
    constructor() {
        super();
        this.keys = ['gnd', 'vcc', 'signal', 'grove'];
        this.requiredKeys = [];
    }
    wired(obniz) {
        this.obniz = obniz;
        if (this.params.grove) {
            const groveAd = this.params.grove.getAnalog('5v', 'secondaryOnly');
            this.ad_signal = groveAd.secondary;
        }
        else {
            this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
            this.ad_signal = obniz.getAD(this.params.signal);
        }
    }
}
exports.default = Grove_DistanceSensor;
