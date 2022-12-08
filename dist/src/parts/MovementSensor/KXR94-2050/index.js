"use strict";
/**
 * @packageDocumentation
 * @module Parts.KXR94-2050
 */
Object.defineProperty(exports, "__esModule", { value: true });
class KXR94_2050 {
    constructor() {
        this.keys = ['x', 'y', 'z', 'vcc', 'gnd', 'enable', 'self_test'];
        this.requiredKeys = ['x', 'y', 'z'];
    }
    static info() {
        return {
            name: 'KXR94-2050',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.ad_x = obniz.getAD(this.params.x);
        this.ad_y = obniz.getAD(this.params.y);
        this.ad_z = obniz.getAD(this.params.z);
        if (obniz.isValidIO(this.params.enable)) {
            obniz.getIO(this.params.enable).drive('5v');
            obniz.getIO(this.params.enable).output(true);
        }
        if (obniz.isValidIO(this.params.self_test)) {
            obniz.getIO(this.params.self_test).drive('5v');
            obniz.getIO(this.params.self_test).output(false);
        }
        this.changeVccVoltage(5);
        this.ad_x.start((value) => {
            this._x_val = value;
            if (this.onChangeX) {
                this.onChangeX(this.voltage2gravity(value));
            }
            if (this.onChange) {
                this.onChange(this._get());
            }
        });
        this.ad_y.start((value) => {
            this._y_val = value;
            if (this.onChangeY) {
                this.onChangeY(this.voltage2gravity(value));
            }
            if (this.onChange) {
                this.onChange(this._get());
            }
        });
        this.ad_z.start((value) => {
            this._z_val = value;
            if (this.onChangeZ) {
                this.onChangeZ(this.voltage2gravity(value));
            }
            if (this.onChange) {
                this.onChange(this._get());
            }
        });
        if (this.obniz.isValidIO(this.params.vcc)) {
            this.obniz.getAD(this.params.vcc).start((value) => {
                this.changeVccVoltage(value);
            });
        }
    }
    changeVccVoltage(pwrVoltage) {
        this.sensitivity = pwrVoltage / 5; // Set sensitivity (unit:V)
        this.offsetVoltage = pwrVoltage / 2; // Set offset voltage (Output voltage at 0g, unit:V)
    }
    voltage2gravity(volt) {
        return (volt - this.offsetVoltage) / this.sensitivity;
    }
    get() {
        return this._get();
    }
    _get() {
        return {
            x: this.voltage2gravity(this._x_val),
            y: this.voltage2gravity(this._y_val),
            z: this.voltage2gravity(this._z_val),
        };
    }
    async getWait() {
        this._x_val = await this.ad_x.getWait();
        this._y_val = await this.ad_y.getWait();
        this._z_val = await this.ad_z.getWait();
        return this._get();
    }
}
exports.default = KXR94_2050;
