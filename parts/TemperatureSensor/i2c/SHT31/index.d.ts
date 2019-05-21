export interface SHT31Options {
  vcc?: number;
  sda?: number;
  scl?: number;
  adr: number;
  gnd?: number;
  addressmode: number;
}

export interface SHT31 {
  getTempWait(): Promise<number>;
  getHumdWait(): Promise<number>;
}
