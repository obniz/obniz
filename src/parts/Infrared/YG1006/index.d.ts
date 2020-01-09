export interface YG1006Options {
  signal: number;
  vcc?: number;
  gnd?: number;
}

export interface YG1006 {
  onchange: (value: number) => void;

  getWait(): Promise<number>;
}
