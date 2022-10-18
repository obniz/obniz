"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LED = void 0;
const Base_1 = require("./Base");
const Error_1 = require("../util/Error");
class LED extends Base_1.Base {
    constructor() {
        super(...arguments);
        this.COLOR_MIN_ = 0;
        this.COLOR_MAX_ = 127;
        this.TIME_MIN_ = 0;
        this.TIME_MAX_ = 65535;
        this.colors = { red: 0, green: 0, blue: 0 };
    }
    /**
     * Verify that the device is MESH block
     *
     * @param name
     * @param opt_serialnumber
     * @returns
     */
    static isMESHblock(name, opt_serialnumber = '') {
        return super.isMESHblock(name, opt_serialnumber)
            ? (name === null || name === void 0 ? void 0 : name.indexOf('MESH-100LE')) !== -1
            : false;
    }
    /**
     * Create command of LED
     *
     * @param colors
     * @param totalTime
     * @param cycleOnTime
     * @param cycleOffTime
     * @param pattern
     * @returns command
     */
    createLedCommand(colors, totalTime, cycleOnTime, cycleOffTime, pattern) {
        // Error Handle
        this.checkRange(colors.red, this.COLOR_MIN_, this.COLOR_MAX_, 'colors.red');
        this.checkRange(colors.green, this.COLOR_MIN_, this.COLOR_MAX_, 'colors.green');
        this.checkRange(colors.blue, this.COLOR_MIN_, this.COLOR_MAX_, 'colors.blue');
        this.checkRange(totalTime, this.TIME_MIN_, this.TIME_MAX_, 'totalTime');
        this.checkRange(cycleOnTime, this.TIME_MIN_, this.TIME_MAX_, 'cycleOnTime');
        this.checkRange(cycleOffTime, this.TIME_MIN_, this.TIME_MAX_, 'cycleOffTIme');
        if (pattern !== LED.PATTERN.BLINK && pattern !== LED.PATTERN.FIREFLY) {
            throw new Error_1.MESHJsInvalidValueError('pattern');
        }
        // Generate Command
        const MESSAGE_TYPE_ID = 1;
        const EVENT_TYPE_ID = 0;
        const FIXED = 0;
        const BYTE = 256;
        const data = [
            MESSAGE_TYPE_ID,
            EVENT_TYPE_ID,
            colors.red,
            FIXED,
            colors.green,
            FIXED,
            colors.blue,
            totalTime % BYTE,
            Math.floor(totalTime / BYTE),
            cycleOnTime % BYTE,
            Math.floor(cycleOnTime / BYTE),
            cycleOffTime % BYTE,
            Math.floor(cycleOffTime / BYTE),
            pattern,
        ];
        data.push(this.checkSum(data));
        return data;
    }
}
exports.LED = LED;
// Constant Values
LED.PATTERN = {
    BLINK: 1,
    FIREFLY: 2,
};
