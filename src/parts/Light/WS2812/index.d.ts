export interface WS2812Options {
  din: number;
  vcc?: number;
  gnd?: number;
}

export interface WS2812 {
  rgb(red: number, green: number, blue: number): void;
  hsv(hue: number, saturation: number, value: number): void;
  rgbs(rgbs: [number, number, number][]): void;
  hsvs(rgbs: [number, number, number][]): void;
}
