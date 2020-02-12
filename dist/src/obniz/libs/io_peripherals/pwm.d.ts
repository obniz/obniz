/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
import Obniz from "../../index";
import { DriveType, PullType } from "./common";
interface PeripheralPWMOptions {
    io: number;
    drive?: DriveType;
    pull?: PullType;
}
export interface PWMInterface {
    freq: (frequency: number) => void;
    pulse: (value: number) => void;
    duty: (value: number) => void;
}
export default class PeripheralPWM implements PWMInterface {
    Obniz: Obniz;
    id: number;
    state: any;
    used: any;
    params: any;
    constructor(obniz: Obniz, id: number);
    _reset(): void;
    sendWS(obj: any): void;
    start(params: PeripheralPWMOptions): void;
    freq(freq: number): void;
    pulse(pulse_width: number): void;
    duty(duty: number): void;
    isUsed(): any;
    end(): void;
    modulate(type: any, symbol_length: any, data: any): void;
}
export {};
