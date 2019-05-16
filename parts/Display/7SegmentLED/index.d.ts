export interface _7SegmentLEDOptions {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
  g: number;
  dp?: number;
  common?: number;
  commonType?: string;
}

export interface _7SegmentLED {
  print(number: number): void;
  printRaw(number: number): void;
  off(): void;
  on(): void;
  dpState(show: boolean): void;
}
