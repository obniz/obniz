/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
import { ComponentAbstract } from '../ComponentAbstact';
declare enum MotionType {
    None = "none",
    Moving = "moving"
}
interface Acceleration {
    r: number;
    t: number;
    p: number;
}
interface MotionRecognition {
    motion: MotionType;
    possibility: number;
}
declare type ObnizTemperatureUpdateCallback = (temperature: number) => void;
declare type ObnizAccelerationUpdateCallback = (r: number, t: number, p: number) => void;
declare type ObnizRecognitionUpdateCallback = (motion: MotionType, possibility: number) => void;
/**
 * GPS/GNSS Service
 *
 * @category Embeds
 */
export declare class Motion extends ComponentAbstract {
    /**
     * Simple Example
     *
     * ```javascript
     * // Javascript Example
     * obniz.motion.onTemperatureUpdate = function(temp) {
     *   console.log(temp)
     * }
     * obniz.motion.onAccelerationUpdate = function(r,t,p) {
     *   console.log(r,t,p)
     * }
     * obniz.motion.onRecognitionUpdate = function(motion, possibility) {
     *   console.log(motion, possibility)
     * }
     * obniz.motion.start();
     * ```
     */
    onTemperatureUpdate?: ObnizTemperatureUpdateCallback;
    onAccelerationUpdate?: ObnizAccelerationUpdateCallback;
    onRecognitionUpdate?: ObnizRecognitionUpdateCallback;
    constructor(obniz: any, info: any);
    protected _reset(): void;
    schemaBasePath(): string;
    start(temp_sensitivity?: number, acceleration_sensitivity?: number, recognition_sensitivity?: number): void;
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
    getTemperatureWait(): Promise<number>;
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
    getAccelerationWait(): Promise<Acceleration>;
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
    getRecognitionWait(): Promise<MotionRecognition>;
}
export {};
