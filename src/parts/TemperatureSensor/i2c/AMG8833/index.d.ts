export interface AMG8833Options {
  vcc?: number;
  gnd?: number;
  sda?: number;
  scl?: number;
  address?: number;
}

export interface AMG8833 {
  getAllPixWait(): Promise<number[]>;
  getOnePixWait(pixel: number): Promise<number>;
}
