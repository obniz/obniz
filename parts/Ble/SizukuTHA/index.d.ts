export interface SizukuTHAOptions {
  serial: string;
}

export interface SizukuTHA {
  connectWait(): Promise<any>;
  getSensors(): Object;
  updateSensors(): void;
}