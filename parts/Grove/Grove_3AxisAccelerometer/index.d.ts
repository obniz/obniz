export interface Grove_3AxisAccelerometerOptions {
  gnd?: number;
  vcc?: number;
  sda: number;
  scl: number;
}

export interface Grove_3AxisAccelerometer {
  getWait(): Promise<number[]>;
}
