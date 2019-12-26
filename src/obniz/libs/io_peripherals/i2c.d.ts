import { PullType } from './common';

export interface I2C {
  onwritten: (data: any) => void;
  onerror: (err: any) => void;

  start(options: {
    mode: 'master' | 'slave';
    sda: number;
    scl: number;
    clock?: number;
    pull?: PullType;
    gnd?: number;
    slave_address?: any;
  }): void;

  write(address: any, data: any): void;
  readWait(address: any, length: any): Promise<any>;
  end(): void;
}
