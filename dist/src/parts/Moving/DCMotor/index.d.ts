/**
 * @packageDocumentation
 * @module Parts.DCMotor
 */
import Obniz from '../../../obniz';
import PeripheralPWM from '../../../obniz/libs/io_peripherals/pwm';
import ObnizPartsInterface, { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface DCMotorOptions {
    forward: number;
    back: number;
}
export interface DCMotorStatus {
    direction: boolean | null;
    power: number;
}
export default class DCMotor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    status: DCMotorStatus;
    params: any;
    forward_io_num: any;
    back_io_num: any;
    pwm: PeripheralPWM;
    obniz: Obniz;
    constructor();
    wired(obniz: Obniz): void;
    forward(): void;
    reverse(): void;
    stop(): void;
    move(forward: any): void;
    power(power?: number): number | undefined;
    private setPwmGnd;
}
