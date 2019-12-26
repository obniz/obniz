export interface FullColorLEDOptions {
  r: number;
  g: number;
  b: number;
  common: number;
  commonType: string;
}

export interface FullColorLED {
  rgb(red: number, green: number, blue: number): void;
  hsv(hue: number, saturation: number, value: number): void;
  gradation(cycle_ms: number): void;
  stopgradation(): void;
}
