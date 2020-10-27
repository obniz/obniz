"use strict";
/**
 * @packageDocumentation
 * @module Parts.KXSC7-2050
 */
Object.defineProperty(exports, "__esModule", { value: true });
class KXSC7_2050 {
    constructor() {
        this.keys = ["x", "y", "z", "vcc", "gnd"];
        this.requiredKeys = ["x", "y", "z"];
    }
    static info() {
        return {
            name: "KXSC7-2050",
        };
    }
    async wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, "3v");
        this.ad_x = obniz.getAD(this.params.x);
        this.ad_y = obniz.getAD(this.params.y);
        this.ad_z = obniz.getAD(this.params.z);
        await obniz.wait(500);
        const ad = obniz.getAD(this.params.vcc);
        const pwrVoltage = await ad.getWait();
        const horizontalZ = await this.ad_z.getWait();
        const sensitivity = pwrVoltage / 5; // Set sensitivity (unit:V)
        const offsetVoltage = horizontalZ - sensitivity; // Set offset voltage (Output voltage at 0g, unit:V)
        const self = this;
        this.ad_x.start((value) => {
            self.gravity = (value - offsetVoltage) / sensitivity;
            if (self.onchangex) {
                self.onchangex(self.gravity);
            }
        });
        this.ad_y.start((value) => {
            self.gravity = (value - offsetVoltage) / sensitivity;
            if (self.onchangey) {
                self.onchangey(self.gravity);
            }
        });
        this.ad_z.start((value) => {
            self.gravity = (value - offsetVoltage) / sensitivity;
            if (self.onchangez) {
                self.onchangez(self.gravity);
            }
        });
    }
}
exports.default = KXSC7_2050;
