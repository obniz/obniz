import { DriveType, PullType } from './common';

export interface PWM {
  start(options: { io: number; drive?: DriveType; pull?: PullType }): void;
  freq(frequency: number): void;
  pulse(ms: number): void;
  duty(ratio: number): void;
  modulate(modulation: 'am', interval: number, data: any): void;
  end(): void;
}
