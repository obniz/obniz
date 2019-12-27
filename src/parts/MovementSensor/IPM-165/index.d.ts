/* tslint:disable:class-name  */
export interface IPM_165Options {
  signal: number;
  vcc?: number;
  gnd?: number;
}

export interface IPM_165 {
  onchange: (value: number) => void;
  getWait(): Promise<number>;
}
