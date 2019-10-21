export interface PochiruOptions {
  serial: string;
}

export interface Pochiru {
  connectWait(): Promise<any>;
  getSensors(): Object;
  updateSensors(): void;
}