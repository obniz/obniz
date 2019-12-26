export interface Grove_EarHeartRateOptions {
  gnd: number;
  vcc: number;
  signal?: number;
}

export interface Grove_EarHeartRate {
  start(callback: (heartrate: any) => void): void;
  getWait(): Promise<any>;
}
