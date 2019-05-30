import { DriveType, PullType, AnimationStatus } from './common';

export interface IO {
  output(value: boolean | 0 | 1): void;
  drive(type: DriveType): void;
  pull(type?: PullType): void;
  input(callback: (value: any) => void): void;
  inputWait(): Promise<any>;
  end(): void;
}
