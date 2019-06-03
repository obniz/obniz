export interface S11059Options {
  vcc?: number;
  sda?: number;
  scl?: number;
  gnd?: number;
  i2c?: any;
}

export type S11059Gain = 0 | 1;
export type S11059IntergerTime = 0 | 1 | 2 | 3;

export interface S11059 {
  init(gain: S11059Gain, intergerTime: S11059IntergerTime): void;
  getVal(): Promise<[number, number, number, number]>;
}
