export interface HCSR04Options {
  gnd?: number;
  echo: number;
  trigger: number;
  vcc: number;
}

export type HCSR04UnitType = 'mm' | 'inch';
export interface HCSR04 {
  temp: number;
  reset_alltime: boolean;
  measure(callback: (distance: number) => void): void;
  measureWait(): Promise<number>;
  unit(unit: HCSR04UnitType): void;
}
