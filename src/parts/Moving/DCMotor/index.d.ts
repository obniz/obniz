export interface DCMotorOptions {
  forward: number;
  back: number;
}

export interface DCMotor {
  forward(): void;
  reverse(): void;
  stop(): void;
  move(forward: boolean): void;
  power(power: number): void;
}
