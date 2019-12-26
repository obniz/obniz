export interface PaPIRsVZOptions {
  signal: number;
  vcc?: number;
  gnd?: number;
}

export interface PaPIRsVZ {
  onchange: (value: boolean) => void;
}
