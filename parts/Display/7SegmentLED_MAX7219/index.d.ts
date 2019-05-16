export interface _7SegmentLED_MAX7219Options {
  clk: number;
  cs: number;
  din: number;
  gnd?: number;
  vcc?: number;
}

export type MAX7219NumberType = 'on' | 'off' | '-' | 'e' | 'h' | 'l' | 'p';
export interface _7SegmentLED_MAX7219 {
  init(numberOfDisplays: number, digits: number): void;
  brightness(display: number, value: number): void;
  brightnessAll(value: number): void;
  setNumber(display: number, digit: number, number: number | MAX7219NumberType, dp: boolean): void;
  clear(display: number): void;
  clearAll(): void;
  test(): void;
}
