export interface ADT7410Options {
  vcc?: number;
  gnd?: number;
  sda?: number;
  scl?: number;
  addressMode: number;
}

export interface ADT7410 {
  getTempWait(): Promise<number>;
}
