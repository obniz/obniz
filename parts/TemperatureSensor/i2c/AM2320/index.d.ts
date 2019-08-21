export interface AM2320ptions {
  vcc?: number;
  gnd?: number;
  sda?: number;
  scl?: number;
  i2c?: any;
}

export interface AM2320 {
  getAllWait(): Promise<{ temperature: number; humidity: number }>;
  getTempWait(): Promise<number>;
  getHumdWait(): Promise<number>;
}
