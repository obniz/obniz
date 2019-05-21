export interface ADT7310Options {
  vcc: number;
  gnd: number;
  din: number;
  dout: number;
  sclk: number;
}

export interface ADT7310 {
  getTempWait(): Promise<number>;
}
