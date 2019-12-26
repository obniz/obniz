export interface LEDOptions {
  anode: number;
  cathode?: number;
}

export interface LED {
  on(): void;
  off(): void;
  output(value: boolean): void;
  blink(interval_ms?: number): void;
  endBlink(): void;
}
