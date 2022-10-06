/**
 * @packageDocumentation
 * @module Parts.FullColorLED
 */
import Obniz from '../../../obniz';
import { PeripheralPWM } from '../../../obniz/libs/io_peripherals/pwm';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface FullColorLEDOptions {
    r: number;
    g: number;
    b: number;
    common: number;
    commonType: string;
}
export default class FullColorLED implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    COMMON_TYPE_ANODE: number;
    COMMON_TYPE_CATHODE: number;
    anode_keys: any;
    cathode_keys: any;
    animationName: any;
    commontype: any;
    common: any;
    pwmR: PeripheralPWM;
    pwmG: PeripheralPWM;
    pwmB: PeripheralPWM;
    protected obniz: Obniz;
    constructor();
    wired(obniz: Obniz): void;
    rgb(red: any, green: any, blue: any): void;
    hsv(hue: number, saturation: number, value: number): void;
    gradation(cycletime_ms: number): void;
    stopgradation(): void;
}
