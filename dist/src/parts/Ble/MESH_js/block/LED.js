"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("./Base");
const MeshJsError_1 = require("../MeshJsError");
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
        if (colors.red < COLOR_MIN || COLOR_MAX < colors.red) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('red', COLOR_MIN, COLOR_MAX);
        }
        if (colors.green < COLOR_MIN || COLOR_MAX < colors.green) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('green', COLOR_MIN, COLOR_MAX);
        }
        if (colors.blue < COLOR_MIN || COLOR_MAX < colors.blue) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('blue', COLOR_MIN, COLOR_MAX);
        }
        const TIME_MIN = 0;
        const TIME_MAX = 65535;
        if (totalTime < TIME_MIN || TIME_MAX < totalTime) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('time', TIME_MIN, TIME_MAX);
        }
        if (cycleOnTime < TIME_MIN || TIME_MAX < cycleOnTime) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('cycle_on', TIME_MIN, TIME_MAX);
        }
        if (cycleOffTime < TIME_MIN || TIME_MAX < cycleOffTime) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('cycle_off', TIME_MIN, TIME_MAX);
        }
        if (pattern !== LED.PATTERN.BLINK && pattern !== LED.PATTERN.FIREFLY) {
            throw new MeshJsError_1.MeshJsInvalidValueError('pattern');
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
