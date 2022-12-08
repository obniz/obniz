/**
 * @packageDocumentation
 * @module Parts.StepperMotor
 */
import Obniz from '../../../obniz';
import { PeripheralIO } from '../../../obniz/libs/io_peripherals/io';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface StepperMotorOptions {
    a: number;
    b: number;
    aa: number;
    bb: number;
    common?: number;
}
export declare type StepType = '1' | '2' | '1-2';
export default class StepperMotor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    type?: string;
    currentStep: number;
    frequency: number;
    rotationStepCount: number;
    milliMeterStepCount: number;
    common: any;
    ios: PeripheralIO[];
    protected obniz: Obniz;
    private _stepInstructions;
    private _stepType;
    constructor();
    wired(obniz: Obniz): void;
    stepWait(step_count: number): Promise<void>;
    stepToWait(destination: number): Promise<void>;
    holdWait(): Promise<void>;
    freeWait(): Promise<void>;
    stepType(stepType: StepType): void;
    speed(step_per_sec: number): void;
    currentRotation(): number;
    currentAngle(): number;
    rotateWait(rotation: number): Promise<void>;
    rotateToWait(angle: number): Promise<void>;
    currentDistance(): number;
    moveWait(distance: number): Promise<void>;
    moveToWait(destination: number): Promise<void>;
    _getStepInstructions(): number[][];
}
