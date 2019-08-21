export interface BME280Options {
  vio?: number;
  vcore?: number;
  gnd?: number;
  csb?: number;
  sdi?: number;
  sck?: number;
  sdo?: number;
  address?: number;
  i2c?: any;
}

export interface BME280 {
  applyCalibration(): Promise<void>;
  setIIRStrength(value?: number): Promise<void>;
  getAllWait(): Promise<{ temperature: number; humidity: number; pressure: number }>;
  calcAltitude(pressure: number, seaPressure?: number): number;
}
