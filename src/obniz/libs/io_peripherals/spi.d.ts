import { DriveType, PullType } from './common';

export interface SPI {
  start(options: {
    mode: 'master';
    clk?: number;
    mosi?: number;
    miso?: number;
    frequency: number;
    drive?: DriveType;
    pull?: PullType;
    gnd?: number;
  }): void;

  writeWait(data: any[]): Promise<any>;
  write(data: any): void;
  end(): void;
}
