export interface IRSensorOptions {
  output: number;
  vcc?: any;
  gnd?: any;
}

export interface IRSensor {
  ondetect: (array: number[]) => void;
  start(callback: (array: number[]) => void): void;
}
