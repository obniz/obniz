export interface USBOptions {
  vcc: number;
  gnd: number;
}

export interface USB {
  on(): void;
  off(): void;
}
