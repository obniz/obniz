export interface PT550Options {
  signal: number;
  vcc: number;
  gnd?: number;
}

export interface PT550 {
  onchange: (value: number) => void;
  getWait(): Promise<number>;
}