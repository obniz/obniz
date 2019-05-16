export interface _7SegmentLEDArrayOptions {
  segments: any[];
}

export interface _7SegmentLEDArray {
  print(number: number): void;
  off(): void;
  on(): void;
}
