export interface WS2811Options {
  gnd?: number;
  vcc?: number;
  din: number;
}

export interface WS2811 {
  rgb(red: number, green: number, blue: number): void;
  hsv(hue: number, saturation: number, value: number): void;
  rgbs(rgbs: [number, number, number][]): void;
  hsvs(rgbs: [number, number, number][]): void;
}
