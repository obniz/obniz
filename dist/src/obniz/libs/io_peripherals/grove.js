"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ComponentAbstact_1 = require("../ComponentAbstact");
/**
 * @category Peripherals
 */
class PeripheralGrove extends ComponentAbstact_1.ComponentAbstract {
    constructor(obniz, no, params) {
        super(obniz);
        this.used = false;
        this._current = {};
        this.no = no;
        this._params = params;
        this._reset();
    }
    getDigital(drive = "5v") {
        this.useWithType("digital", drive);
        const primary = this.Obniz.isValidIO(this._params.pin1) ? this.Obniz.getIO(this._params.pin1) : undefined;
        const secondary = this.Obniz.isValidIO(this._params.pin2) ? this.Obniz.getIO(this._params.pin2) : undefined;
        return { primary, secondary };
    }
    getAnalog(drive = "5v") {
        this.useWithType("analog", drive);
        const primary = this.Obniz.isValidAD(this._params.pin1) ? this.Obniz.getAD(this._params.pin1) : undefined;
        const secondary = this.Obniz.isValidAD(this._params.pin2) ? this.Obniz.getAD(this._params.pin2) : undefined;
        return { primary, secondary };
    }
    getAnalogDigital(drive = "5v") {
        this.useWithType("analog-digital", drive);
        const analog = this.Obniz.isValidAD(this._params.pin1) ? this.Obniz.getAD(this._params.pin1) : undefined;
        const digital = this.Obniz.isValidIO(this._params.pin2) ? this.Obniz.getIO(this._params.pin2) : undefined;
        return { analog, digital };
    }
    getI2c(frequency, drive = "5v") {
        this.useWithType("i2c", drive);
        if (!this._current.i2c) {
            this._current.i2c = this.Obniz.getI2CWithConfig({
                mode: "master",
                sda: this._params.pin2,
                scl: this._params.pin1,
                clock: frequency,
            });
        }
        return this._current.i2c;
    }
    getUart(baud, drive = "5v") {
        this.useWithType("uart", drive);
        this._current.uart = this.Obniz.getFreeUart();
        this._current.uart.start({
            rx: this._params.pin1,
            tx: this._params.pin2,
            baud,
            drive,
        });
        return this._current.uart;
    }
    /**
     * @ignore
     */
    _reset() { }
    end() {
        this.used = false;
        if (this._current.uart) {
            this._current.uart.end();
        }
        if (this._current.i2c) {
            this._current.i2c.end();
        }
        if (this._current.type === "analog") {
            if (this.Obniz.isValidAD(this._params.pin1)) {
                this.Obniz.getAD(this._params.pin1).end();
            }
            if (this.Obniz.isValidAD(this._params.pin2)) {
                this.Obniz.getAD(this._params.pin2).end();
            }
        }
        else if (this._current.type === "analog-digital") {
            if (this.Obniz.isValidAD(this._params.pin1)) {
                this.Obniz.getAD(this._params.pin1).end();
            }
            // if (this.Obniz.isValidIO(this._params.pin2)) {
            //   this.Obniz.getIO(this._params.pin2).end();
            // }
        }
        this._current = {};
    }
    /**
     * @ignore
     * @param obj
     */
    notified(obj) {
        // nothing
    }
    schemaBasePath() {
        return null;
    }
    useWithType(type, drive) {
        if (this.used) {
            if (this._current.type !== "i2c" || this._current.drive !== drive) {
                throw new Error("Grove pins are already used.");
            }
        }
        this.used = true;
        this._current.type = type;
        this._current.drive = drive;
        this.Obniz.setVccGnd(this._params.vcc, this._params.gnd, drive);
        if (this.Obniz.isValidIO(this._params.pin1)) {
            this.Obniz.getIO(this._params.pin1).drive(drive);
        }
        if (this.Obniz.isValidIO(this._params.pin2)) {
            this.Obniz.getIO(this._params.pin2).drive(drive);
        }
    }
}
exports.default = PeripheralGrove;

//# sourceMappingURL=grove.js.map
