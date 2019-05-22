export interface GP2Y0A21YK0FOptions {
  vcc?: number;
  gnd?: number;
  signal: number;
}

export type GP2Y0A21YK0FUnitType = 'mm' | 'inch';
export interface GP2Y0A21YK0F {
  start(callback: (distance: number) => void): void;
  getWait(): Promise<number>;
  unit(unit: GP2Y0A21YK0FUnitType): void;
}
