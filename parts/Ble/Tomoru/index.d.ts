export interface TomoruOptions {
  serial: string;
}

export interface Tomoru {
  connectWait(): Promise<any>;
  getSensors(): Object;
  updateSensors(): void;
}