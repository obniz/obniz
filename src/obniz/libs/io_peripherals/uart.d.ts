import { DriveType, PullType, StopBitType, BitType, ParityType, FlowControlType } from './common';

export interface UART {
  onreceive: (data: any, text: string) => void;

  start(options: {
    tx: number;
    rx: number;
    gnd?: number;
    baud?: number;
    stop?: StopBitType;
    bits?: BitType;
    parity?: ParityType;
    flowcontrol?: FlowControlType;
    rts?: number;
    cts?: number;
    drive?: DriveType;
    pull?: PullType;
  }): void;

  send(data: any): void;
  end(): void;
  isDataExists(): boolean;
  readByte(): any;
  readBytes(): any[];
  readText(): string;
}
