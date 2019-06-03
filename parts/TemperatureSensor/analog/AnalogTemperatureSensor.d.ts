export interface AnalogTemperatureSensorOptions {
  vcc?: number;
  output: number;
  gnd?: number;
}

export interface AnalogTemperatureSensor {
  onchange: (temp: number) => void;
  getWait(): Promise<number>;
}
