export interface SolenoidOptions {
  signal: number;
  gnd?: number;
}

export interface Solenoid {
  on(): void;
  off(): void;
  click(msec?: number): void;
  doubleClick(msec?: number): void;
}
