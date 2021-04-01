/**
 * @packageDocumentation
 * @module Parts.DCMotor
 */
import Obniz from "../../../obniz";
import PeripheralPWM from "../../../obniz/libs/io_peripherals/pwm";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface DCMotorOptions {
    forward: number;
    back: number;
}
export default class DCMotor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    status: any;
    pwm1_io_num: any;
    params: any;
    pwm2_io_num: any;
    pwm1: PeripheralPWM;
    pwm2: PeripheralPWM;
    constructor();
    wired(obniz: Obniz): void;
    forward(): void;
    reverse(): void;
    stop(): void;
    move(forward: any): void;
    power(power?: any): any;
}
