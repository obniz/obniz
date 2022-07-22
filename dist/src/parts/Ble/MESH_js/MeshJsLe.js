"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MeshJs_1 = require("./MeshJs");
const MeshJsError_1 = require("./MeshJsError");
class MeshJsLe extends MeshJs_1.MeshJs {
    /**
     *
     * @param red
     * @param green
     * @param blue
     * @param totalTime
     * @param cycleOnTime
     * @param cycleOffTime
     * @param pattern
     * @returns
     */
    parseLightupCommand(red, green, blue, totalTime, cycleOnTime, cycleOffTime, pattern) {
        // Error Handle
        const COLOR_MIN = 0;
        const COLOR_MAX = 127;
        if (red < COLOR_MIN || COLOR_MAX < red) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('red', COLOR_MIN, COLOR_MAX);
        }
        if (green < COLOR_MIN || COLOR_MAX < green) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('green', COLOR_MIN, COLOR_MAX);
        }
        if (blue < COLOR_MIN || COLOR_MAX < blue) {
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
        if (pattern !== MeshJsLe.PATTERN.BLINK &&
            pattern !== MeshJsLe.PATTERN.SOFT) {
            throw new MeshJsError_1.MeshJsOutOfRangeError('pattern');
        }
        // Generate Command
        const MESSAGE_TYPE_ID = 1;
        const EVENT_TYPE_ID = 0;
        const FIXED = 0;
        const BYTE = 256;
        const data = [
            MESSAGE_TYPE_ID,
            EVENT_TYPE_ID,
            red,
            FIXED,
            green,
            FIXED,
            blue,
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
exports.MeshJsLe = MeshJsLe;
// Constant Values
MeshJsLe.PATTERN = {
    BLINK: 1,
    SOFT: 2,
};
