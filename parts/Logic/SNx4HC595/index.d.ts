export interface SNx4HC595Options {
  gnd?: number;
  vcc?: number;
  ser: number;
  srclk: number;
  rclk: number;
  oe?: number;
  srclr?: number;
  io_num?: number;
  enabled?: boolean;
}

export interface SNx4HC595 {
  ioNum(num: number): void;
  output(io: number, value: boolean): void;
  onece(func: () => void): void;
  getIO(io: number): any;
  setEnable(enabled: boolean): void;
}
