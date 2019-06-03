export interface IRSensorOptions {
  output: number;
  vcc?: any;
  gnd?: any;
}

export interface IRSensor {
  dataSymbolLength: number;
  duration: number;
  dataInverted: boolean;
  cutTail: boolean;
  output_pullup: boolean;
  ondetect: (array: number[]) => void;
  start(callback?: (array: number[]) => void): void;
}
