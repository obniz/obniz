export interface SizukuLUXOptions {
  serial: string;
}

export interface SizukuLUX {
  connectWait(): Promise<any>;
  getSensors(): Object;
  updateSensors(): void;
}