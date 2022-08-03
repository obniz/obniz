"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const Error_1 = require("../util/Error");
class LED extends Base_1.Base {
    constructor() {
        super(...arguments);
        this.colors = { red: 0, green: 0, blue: 0 };
    }
    /**
     *
     * @param colors
     * @param totalTime
     * @param cycleOnTime
     * @param cycleOffTime
     * @param pattern
     * @returns
     */
    parseLedCommand(colors, totalTime, cycleOnTime, cycleOffTime, pattern) {
        // Error Handle
        const COLOR_MIN = 0;
        const COLOR_MAX = 127;
        this.checkRange(colors.red, COLOR_MIN, COLOR_MAX, 'colors.red');
        this.checkRange(colors.green, COLOR_MIN, COLOR_MAX, 'colors.green');
        this.checkRange(colors.blue, COLOR_MIN, COLOR_MAX, 'colors.blue');
        const TIME_MIN = 0;
        const TIME_MAX = 65535;
        this.checkRange(totalTime, TIME_MIN, TIME_MAX, 'totalTime');
        this.checkRange(cycleOnTime, TIME_MIN, TIME_MAX, 'cycleOnTime');
        this.checkRange(cycleOffTime, TIME_MIN, TIME_MAX, 'cycleOffTIme');
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
