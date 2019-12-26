export interface SEN0114Options {
  vcc?: number;
  output: number;
  gnd?: number;
}

export interface SEN0114 {
  onchange: (value: number) => void;
  getHumidityWait(): Promise<number>;
}
