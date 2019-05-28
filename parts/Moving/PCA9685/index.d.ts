export interface PCA9685Options {
  gnd?: number;
  vcc?: number;
  oe?: number;
  scl?: number;
  sda?: number;
  i2c?: any; // TODO: i2c object
  enabled?: boolean;
  address?: number;
  drive?: string;
}

export interface PCA9685 {
  getPWM(num: number): any;
  freq(frequency: number): void;
  duty(index: number, duty: number): void;
  pulse(index: number, pulse_width: number): void;
  setEnable(enabled: boolean): void;
}
