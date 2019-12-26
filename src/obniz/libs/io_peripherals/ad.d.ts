export interface AD {
  value: number;
  onchange: (voltage: number) => void;
  start(callback?: (voltage: number) => void): void;
  getWait(): Promise<number>;
  end(): void;
}
