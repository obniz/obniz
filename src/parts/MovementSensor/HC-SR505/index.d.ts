export interface HCSR505Options {
  signal: number;
  vcc?: number;
  gnd?: number;
}

export interface HCSR505 {
  onchange: (value: boolean) => void;
  getWait(): Promise<boolean>;
}
