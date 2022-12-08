/**
 * @packageDocumentation
 * @module Parts.DCMotor
 */
import Obniz from '../../../obniz';
import { PeripheralPWM } from '../../../obniz/libs/io_peripherals/pwm';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
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
    /**
     * Start rotation to the forward direction.
     */
    forward(): void;
    /**
     * Start rotation to the reverse direction.
     */
    reverse(): void;
    /**
     * Stop rotation.
     */
    stop(): void;
    /**
     * Start rotation by specifying rotation direction.
     *
     * @param forward true is forward rotation, and false is reverse rotation.
     */
    move(forward?: boolean): void;
    /**
     * Set the motor power.
     *
     * @param power Specify between 0 and 100.
     */
    power(power: number): void;
    private setPwmGndPin;
}
