export interface ServoMotorOptions {
  vcc?: number;
  gnd?: number;
  signal?: number;
  pwm?: any; // TODO: PWM object
}

export interface ServoMotor {
  range: { min: number; max: number };
  angle(degree: number): void;
  on(): void;
  off(): void;
}
