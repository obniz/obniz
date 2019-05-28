export interface StepperMotorOptions {
  a: number;
  b: number;
  aa: number;
  bb: number;
  common?: number;
}

export type StepType = '1' | '2' | '1-2';
export interface StepperMotor {
  currentStep: number;
  rotationStepCount: number;
  milliMeterStepCount: number;
  currentRotation(): number;
  currentAngle(): number;
  currentDistance(): number;
  stepType(type: StepType): void;
  speed(frequency: number): void;
  stepWait(step: number): Promise<void>;
  stepToWait(destination: number): Promise<void>;
  holdWait(): Promise<void>;
  freeWait(): Promise<void>;
  rotateWait(rotation: number): Promise<void>;
  rotateToWait(rotation: number): Promise<void>;
  moveWait(distance: number): Promise<void>;
  moveToWait(destination: number): Promise<void>;
}
