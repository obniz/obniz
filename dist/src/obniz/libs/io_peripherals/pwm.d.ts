/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
import Obniz from '../../index';
import { ComponentAbstract } from '../ComponentAbstact';
import { DriveType, PullType } from './common';
interface PeripheralPWMOptions {
    /**
     * device io number
     */
    io: number;
    drive?: DriveType;
    pull?: PullType;
}
export interface PWMInterface {
    freq: (frequency: number) => void;
    pulse: (value: number) => void;
    duty: (value: number) => void;
}
/**
 * Modulate type.
 *
 * Currently only "am" are supported
 */
export declare type PWMModulateType = 'am';
/**
 * We will now generate PWM.
 * Maximum current depends on the driving mode. See [[PeripheralIO|io]].
 *
 * @category Peripherals
 */
export declare class PeripheralPWM extends ComponentAbstract implements PWMInterface {
    /**
     * @ignore
     */
    used: boolean;
    private id;
    private state;
    private params;
    constructor(obniz: Obniz, id: number);
    /**
     * This starts a pwm on a given io.
     * freq=1khz, duty=0% at start.
     *
     * io drive and pull can be configured. See more details on [[PeripheralIO|io]]
     *
     * ```javascript
     * // Javascript Example
     * var pwm = obniz.getFreePwm();
     * pwm.start({io:0}); // start pwm. output at io0
     * pwm.freq(1000);
     * pwm.duty(50);
     *
     * var pwm2 = obniz.getFreePwm();
     * pwm2.start({io:1, drive:"open-drain", pull:"5v"});
     * ```
     *
     * @param params
     */
    start(params: PeripheralPWMOptions): void;
    /**
     * Set frequency, not pulse duration.
     *
     *
     * For example, this value will be 1khz with DC motor.
     *
     * ```javascript
     * // Javascript Example
     * var pwm = obniz.getFreePwm();
     * pwm.start({io:0});
     * pwm.freq(1000); // set pwm. frequency to 1khz
     * ```
     *
     * @param freq frequency (Hz)
     */
    freq(freq: number): void;
    /**
     * Set pulse duty
     *
     * ```javascript
     * // Javascript Example
     * var pwm = obniz.getFreePwm();
     * pwm.start({io:0});
     * pwm.freq(2000); // set pwm frequency to 2khz
     * pwm.pulse(0.5) // set pwm pulse 0.5ms.  so this is  25% ratio.
     * ```
     *
     * @param pulse_width pulse time (ms).
     */
    pulse(pulse_width: number): void;
    /**
     * Set pulse duty in terms of ratio.
     *
     * ```javascript
     * // Javascript Example
     * var pwm = obniz.getFreePwm();
     * pwm.start({io:0});
     * pwm.freq(2000); // set pwm frequency to 2khz
     * pwm.duty(50) // set pwm pulse width 50%
     * ```
     *
     * @param duty
     */
    duty(duty: number): void;
    /**
     * @ignore
     */
    isUsed(): boolean;
    /**
     * It stops pwm and releases io.
     *
     * ```javascript
     * // Javascript Example
     * var pwm = obniz.getFreePwm();
     * pwm.start({io:0});
     * pwm.end();
     * ```
     */
    end(): void;
    /**
     * This modulates pwm with data.
     *
     * Modulation can be chosen from below.
     *
     * 1. "am"
     *
     * ### am modulation
     * data "1" means put out the pwm with duty ratio of 50%. "0" means stop pwm. io will be 0.
     * Interval defines the symbol baud rate.
     * Duty is fixed at 50%.
     *
     *
     * ![](media://pwm_modu.png)
     *
     * This is useful to generate IR signal (Remote control).
     * Frequency of 38kHz gets modulated with signals.
     *
     * @param type
     * @param symbol_length
     * @param data data array. All data[index] is 0 or 1.
     */
    modulate(type: PWMModulateType, symbol_length: number, data: number[]): void;
    /**
     * @ignore
     * @private
     */
    schemaBasePath(): string;
    /**
     * @ignore
     * @private
     */
    protected _reset(): void;
    private sendWS;
}
export {};
