export interface Sizuku6xOptions {
  serial: string;
}

export interface Sizuku6x {
  connectWait(): Promise<any>;
  getSensors(): Object;
  updateSensors(): void;
}