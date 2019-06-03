// TODO: README と実装が異なっているが、パーツライブラリには載っていないパーツ
export interface S5851AOptions {
  vcc: number;
  gnd: number;
  sda: number;
  scl: number;
  addr0: number;
  addr1: number;
  addressmode: string;
}

export interface S5851A {
  getTempWait(): Promise<number>;
  getHumdWait(): Promise<number>;
}
