"use strict";
/**
 * @packageDocumentation
 * @module Parts.7SegmentLED_MAX7219
 */
Object.defineProperty(exports, "__esModule", { value: true });
class _7SegmentLED_MAX7219 {
    constructor() {
        this.keys = ['vcc', 'gnd', 'din', 'cs', 'clk'];
        this.requiredKeys = ['din', 'cs', 'clk'];
    }
    static info() {
        return {
            name: '7SegmentLED_MAX7219',
        };
    }
    wired(obniz) {
        this.cs = obniz.getIO(this.params.cs);
        // logich high must 3.5v <=
        if (obniz.isValidIO(this.params.vcc)) {
            obniz.getIO(this.params.vcc).output(true);
        }
        if (obniz.isValidIO(this.params.gnd)) {
            obniz.getIO(this.params.gnd).output(false);
        }
        // max 10Mhz but motor driver can't
        this.params.frequency = this.params.frequency || 10 * 1000 * 1000;
        this.params.mode = 'master';
        this.params.mosi = this.params.din;
        this.params.drive = '3v';
        this.spi = this.obniz.getSpiWithConfig(this.params);
        // reset a onece
        this.cs.output(true);
        this.cs.output(false);
        this.cs.output(true);
    }
    init(numberOfDisplays, digits) {
        this.numOfDisp = numberOfDisplays;
        this.digits = digits;
        this.writeAllDisp([0x09, 0xff]); // Code B decode for digits 7-0
        this.writeAllDisp([0x0a, 0x05]); // brightness 11/32 0 to f
        this.writeAllDisp([0x0b, digits - 1]);
        this.writeAllDisp([0x0c, 0x01]); // Shutdown to normal operation
        this.writeAllDisp([0x0f, 0x00]);
        this.obniz.wait(10);
    }
    clear(disp) {
        for (let i = 0; i < this.digits; i++) {
            this.writeOneDisp(disp, [i + 1, 0x0f]);
        }
    }
    clearAll() {
        for (let i = 0; i < this.numOfDisp; i++) {
            for (let j = 0; j < this.digits; j++) {
                this.writeAllDisp([j + 1, 0x0f]);
            }
        }
    }
    test() {
        this.writeAllDisp([0x0f, 0x00]); // test command
    }
    brightness(display, value) {
        this.writeOneDisp(display, [0x0a, value]); // 0 to 15;
    }
    brightnessAll(value) {
        this.writeAllDisp([0x0a, value]); // 0 to 15;
    }
    writeAllDisp(data) {
        for (let i = 0; i < this.numOfDisp; i++) {
            this.writeOneDisp(i, data);
        }
    }
    writeOneDisp(disp, data) {
        this.cs.output(false);
        for (let i = 0; i < disp; i++) {
            this.spi.write([0x00, 0x00]);
        }
        this.spi.write(data);
        for (let i = 0; i < this.numOfDisp - (disp + 1); i++) {
            this.spi.write([0x00, 0x00]);
        }
        this.cs.output(true);
    }
    setNumber(display, digit, number, dp) {
        if (digit >= 0 && digit <= this.digits - 1) {
            this.writeOneDisp(display, [digit + 1, this.encodeBCD(number, dp)]);
        }
    }
    encodeBCD(decimal, dp) {
        const dpreg = dp === true ? 0x80 : 0x00;
        if (decimal >= 0 && decimal <= 9) {
            return decimal | dpreg;
        }
        else if (decimal === '-' || decimal === 10) {
            return 0x0a | dpreg;
        }
        else if (decimal === 'e' || decimal === 11) {
            return 0x0b | dpreg;
        }
        else if (decimal === 'h' || decimal === 12) {
            return 0x0c | dpreg;
        }
        else if (decimal === 'l' || decimal === 13) {
            return 0x0d | dpreg;
        }
        else if (decimal === 'p' || decimal === 14) {
            return 0x0e | dpreg;
        }
        else if (decimal === 'on') {
            // light all segments
            return 0x88;
        }
        else if (decimal === 'off') {
            return 0x0f | dpreg;
        }
        else {
            return 0x0f | dpreg;
        }
    }
}
exports.default = _7SegmentLED_MAX7219;
