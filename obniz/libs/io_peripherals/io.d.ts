import { DriveType, PullType, AnimationStatus } from './common';

export interface IO {
  output(value: boolean): void;
  drive(type: DriveType): void;
  pull(type?: PullType): void;
  input(callback: (value: any) => void): void;
  inputWait(): Promise<any>;
  end(): void;
  animation(name: string, status: AnimationStatus, animations?: any[], repeat?: number): void;
  repeatWait(animations?: any[], repeat?: number): Promise<void>;
}
