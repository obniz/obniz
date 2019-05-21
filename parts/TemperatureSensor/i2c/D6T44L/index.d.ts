export interface D6T44LOptions {
  gnd?: number;
  vcc?: number;
  sda?: number;
  scl?: number;
}

export interface D6T44L {
  getAllPixWait(): Promise<number[]>;
  getOnePixWait(pixel: number): Promise<number>;
}
