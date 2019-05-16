export interface IRModuleOptions {
  send: number;
  recv: number;
  vcc?: number;
  gnd?: number;
}

export interface IRModule {
  ondetect: (array: number[]) => void;
  dataSymbolLength: number;
  start(callback: (array: number[]) => void): void;
  send(array: number[]): void;
}
