export interface CT10Options {
  signal: number;
  vcc?: number;
  gnd?: number;
}

export interface CT10 {
  onchange: (near: boolean) => void;

  isNearWait(): Promise<boolean>;

  stateWait(isNear: boolean): Promise<void>;
}
