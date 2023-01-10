/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
import Obniz from '../../index';
import { ComponentAbstract } from '../ComponentAbstact';
import { PeripheralAD } from './ad';
import { DriveType } from './common';
import { PeripheralI2C } from './i2c';
import { PeripheralIO } from './io';
import { PeripheralPWM } from './pwm';
import { PeripheralUART } from './uart';
export interface PeripheralGroveParams {
    pin1: number;
    pin2: number;
    vcc?: number;
    gnd?: number;
}
export declare type PeripheralGroveType = 'digital' | 'analog' | 'analog-digital' | 'i2c' | 'uart' | 'pwm';
export declare type GrovePinOption = 'default' | 'secondaryOnly';
/**
 * @category Peripherals
 */
export declare class PeripheralGrove extends ComponentAbstract {
    no: number;
    used: boolean;
    private _params;
    private _current;
    constructor(obniz: Obniz, no: number, params: PeripheralGroveParams);
    getDigital(drive?: DriveType, pinOption?: GrovePinOption): {
        primary: PeripheralIO;
        secondary?: PeripheralIO;
    };
    getAnalog(drive?: DriveType, pinOption?: GrovePinOption): {
        primary?: PeripheralAD;
        secondary?: PeripheralAD;
    };
    getAnalogDigital(drive?: DriveType): {
        analog: PeripheralAD;
        digital: PeripheralIO;
    };
    getI2c(frequency: number, drive?: DriveType): PeripheralI2C;
    getUart(baud: number, drive?: DriveType): PeripheralUART;
    getPwm(drive?: DriveType): PeripheralPWM;
    /**
     * @ignore
     */
    _reset(): void;
    end(): void;
    /**
     * @ignore
     * @param obj
     */
    notified(obj: number): void;
    schemaBasePath(): null;
    private useWithType;
}
