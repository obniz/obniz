export = StepperMotor;
declare class StepperMotor {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    _stepInstructions: {
        '1': number[][];
        '2': number[][];
        '1-2': number[][];
    };
    type: string | undefined;
    currentStep: number;
    _stepType: string;
    frequency: number;
    rotationStepCount: number;
    milliMeterStepCount: number;
    wired(obniz: any): void;
    obniz: any;
    common: any;
    ios: any[] | undefined;
    stepWait(step_count: any): Promise<void>;
    stepToWait(destination: any): Promise<void>;
    holdWait(): Promise<void>;
    freeWait(): Promise<void>;
    stepType(stepType: any): void;
    speed(step_per_sec: any): void;
    currentRotation(): number;
    currentAngle(): number;
    rotateWait(rotation: any): Promise<void>;
    rotateToWait(angle: any): Promise<void>;
    currentDistance(): number;
    moveWait(distance: any): Promise<void>;
    moveToWait(destination: any): Promise<void>;
    _getStepInstructions(): any;
}
