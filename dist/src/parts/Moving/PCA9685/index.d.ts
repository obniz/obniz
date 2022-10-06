/**
 * @packageDocumentation
 * @module Parts.PCA9685
 */
import Obniz from '../../../obniz';
import { PeripheralI2C } from '../../../obniz/libs/io_peripherals/i2c';
import { PWMInterface } from '../../../obniz/libs/io_peripherals/pwm';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
declare class PCA9685_PWM implements PWMInterface {
    chip: PCA9685;
    id: number;
    value: number;
    state: any;
    constructor(chip: PCA9685, id: number);
    freq(frequency: number): void;
    pulse(value: number): void;
    duty(value: number): void;
}
export interface PCA9685Options {
    gnd?: number;
    vcc?: number;
    oe?: number;
    scl?: number;
    sda?: number;
    i2c?: PeripheralI2C;
    enabled?: boolean;
    address?: number;
    drive?: string;
}
export default class PCA9685 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    address: any;
    _commands: any;
    _regs: any;
    pwmNum: any;
    pwms: PCA9685_PWM[];
    params: any;
    io_srclr: any;
    chip: any;
    id: any;
    value: any;
    state: any;
    protected obniz: Obniz;
    private io_oe?;
    private i2c;
    private _freq;
    constructor();
    wired(obniz: Obniz): void;
    _preparePWM(num: any): void;
    isValidPWM(id: any): boolean;
    getPWM(id: number): PCA9685_PWM;
    freq(frequency: number): void;
    pulse(index: number, pulse_width: number): void;
    duty(index: number, duty: number): void;
    writeSingleONOFF(index: number, on: number, off: number): void;
    setEnable(enable: boolean): void;
}
export {};
