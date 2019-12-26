export interface SpeakerOptions {
  signal: number;
  gnd?: number;
}

export interface Speaker {
  play(frequency: number): void;
  stop(): void;
}
