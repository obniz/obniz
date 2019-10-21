export interface KizukuOptions {
  serial: string;
}

export interface Kizuku {
  connectWait(): Promise<any>;
  getSensors(): Object;
  updateSensors(): void;
}