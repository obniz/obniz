declare class StepperMotor {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    _stepInstructions: any;
    type: any;
    currentStep: any;
    _stepType: any;
    frequency: any;
    rotationStepCount: any;
    milliMeterStepCount: any;
    obniz: any;
    params: any;
    common: any;
    ios: any;
    constructor();
    wired(obniz: any): void;
    stepWait(step_count: any): Promise<void>;
    stepToWait(destination: any): Promise<void>;
    holdWait(): Promise<void>;
    freeWait(): Promise<void>;
    stepType(stepType: any): void;
    speed(step_per_sec: any): void;
    currentRotation(): number;
    currentAngle(): any;
    rotateWait(rotation: any): Promise<void>;
    rotateToWait(angle: any): Promise<void>;
    currentDistance(): number;
    moveWait(distance: any): Promise<void>;
    moveToWait(destination: any): Promise<void>;
    _getStepInstructions(): any;
}
export default StepperMotor;
