"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Motion = void 0;
const ComponentAbstact_1 = require("../ComponentAbstact");
var MotionType;
(function (MotionType) {
    MotionType["None"] = "none";
    MotionType["Moving"] = "moving";
})(MotionType || (MotionType = {}));
/**
 * GPS/GNSS Service
 *
 * @category Embeds
 */
class Motion extends ComponentAbstact_1.ComponentAbstract {
    constructor(obniz, info) {
        super(obniz);
        this.on('/response/motion/temperature', (obj) => {
            this.Obniz._runUserCreatedFunction(this.onTemperatureUpdate, obj.temperature);
        });
        this.on('/response/motion/acceleration', (obj) => {
            this.Obniz._runUserCreatedFunction(this.onAccelerationUpdate, obj.acceleration.r, obj.acceleration.t, obj.acceleration.p);
        });
        this.on('/response/motion/recognition', (obj) => {
            this.Obniz._runUserCreatedFunction(this.onRecognitionUpdate, obj.recognition.motion, obj.recognition.possibility);
        });
        this._reset();
    }
    _reset() {
        // No Need to reset
    }
    schemaBasePath() {
        return 'motion';
    }
    start(temp_sensitivity = 0, acceleration_sensitivity = 0, recognition_sensitivity = 0) {
        const motion = {};
        if (temp_sensitivity > 0) {
            motion.temperature = {
                mode: 'sensitive',
                sensitivity: temp_sensitivity,
            };
        }
        if (acceleration_sensitivity > 0) {
            motion.acceleration = {
                mode: 'sensitive',
                sensitivity: acceleration_sensitivity,
            };
        }
        if (recognition_sensitivity > 0) {
            motion.recognition = {
                mode: 'sensitive',
                sensitivity: recognition_sensitivity,
            };
        }
        const obj = {
            motion,
        };
        this.Obniz.send(obj);
    }
    /**
     * One shot getting
     *
     * ```javascript
     * var value = obniz.motion.getTemperatureWait();
     * // 25.0
     * ```
     *
     * @return temperature in degree Celsius
     *
     */
    async getTemperatureWait() {
        const obj = {};
        obj.motion = {
            temperature: {
                mode: 'oneshot',
                sensitivity: 1,
            },
        };
        const data = await this.sendAndReceiveJsonWait(obj, '/response/motion/temperature');
        return data.temperature;
    }
    /**
     * One shot getting
     *
     * ```javascript
     * var value = obniz.motion.getAccelerationWait();
     * // { r: 0.1, theta: 90, phi: 90 }
     * ```
     *
     * @return acceleration
     *
     */
    async getAccelerationWait() {
        const obj = {};
        obj.motion = {
            acceleration: {
                mode: 'oneshot',
                sensitivity: 1,
            },
        };
        const data = await this.sendAndReceiveJsonWait(obj, '/response/motion/acceleration');
        return data.acceleration;
    }
    /**
     * One shot getting
     *
     * ```javascript
     * var value = obniz.motion.getRecognitionWait();
     * // { motion: 'moving', possibility: 0.5 }
     * ```
     *
     * @return recognition
     *
     */
    async getRecognitionWait() {
        const obj = {};
        obj.motion = {
            recognition: {
                mode: 'oneshot',
                sensitivity: 1,
            },
        };
        const data = await this.sendAndReceiveJsonWait(obj, '/response/motion/recognition');
        return data.recognition;
    }
}
exports.Motion = Motion;
