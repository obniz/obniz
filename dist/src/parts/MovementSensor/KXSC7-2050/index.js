"use strict";
/**
 * @packageDocumentation
 * @module Parts.KXSC7-2050
 */
Object.defineProperty(exports, "__esModule", { value: true });
class KXSC7_2050 {
    constructor() {
        this.keys = ['x', 'y', 'z', 'vcc', 'gnd'];
        this.requiredKeys = ['x', 'y', 'z'];
    }
    static info() {
        return {
            name: 'KXSC7-2050',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, '3v');
        this.ad_x = obniz.getAD(this.params.x);
        this.ad_y = obniz.getAD(this.params.y);
        this.ad_z = obniz.getAD(this.params.z);
        this.initWait();
    }
    async initWait() {
        await this.obniz.wait(500);
        const ad = this.obniz.getAD(this.params.vcc);
        const pwrVoltage = await ad.getWait();
        const horizontalZ = await this.ad_z.getWait();
        const sensitivity = pwrVoltage / 5; // Set sensitivity (unit:V)
        const offsetVoltage = horizontalZ - sensitivity; // Set offset voltage (Output voltage at 0g, unit:V)
        this.ad_x.start((value) => {
            this.gravity = (value - offsetVoltage) / sensitivity;
            if (this.onchangex) {
                this.onchangex(this.gravity);
            }
        });
        this.ad_y.start((value) => {
            this.gravity = (value - offsetVoltage) / sensitivity;
            if (this.onchangey) {
                this.onchangey(this.gravity);
            }
        });
        this.ad_z.start((value) => {
            this.gravity = (value - offsetVoltage) / sensitivity;
            if (this.onchangez) {
                this.onchangez(this.gravity);
            }
        });
    }
}
exports.default = KXSC7_2050;
