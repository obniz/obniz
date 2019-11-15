export interface HMC5883LOptions {
  gnd?: number;
  sda?: number;
  scl?: number;
  i2c?: number;
}

export interface HMC5883L {
  init(): void;
  get(): Promise<{ x: number; y: number; z: number }>;
}
