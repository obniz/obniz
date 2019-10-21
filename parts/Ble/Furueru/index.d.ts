export interface FurueruOptions {
  serial: string;
}

export interface Furueru {
  connectWait(): Promise<any>;
  getSensors(): Object;
  updateSensors(): void;
}