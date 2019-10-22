export interface OshieruOptions {
  serial: string;
}

export interface Oshieru {
  connectWait(): Promise<any>;
  getSensors(): Object;
  updateSensors(): void;
}