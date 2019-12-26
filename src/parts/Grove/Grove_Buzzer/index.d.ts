export interface Grove_BuzzerOprions {
  signal: number;
  gnd?: number;
  vcc?: number;
}

export interface Grove_Buzzer {
  play(frequency: number): void;
  stop(): void;
}