export interface IRModuleOptions {
  send: number;
  recv: number;
  vcc?: number;
  gnd?: number;
}

export interface IRModule {
  dataSymbolLength: number;
  duration: number;
  dataInverted: boolean;
  cutTail: boolean;
  output_pullup: boolean;
  ondetect: (array: number[]) => void;
  start(callback?: (array: number[]) => void): void;
  send(array: number[]): void;
}
