export interface Grove_MP3Options {
  vcc?: number;
  gnd?: number;
  mp3_rx: number;
  mp3_tx: number;
}

export interface Grove_MP3 {
  initWait(): Promise<void>;
  setVolume(vol: number): void;
  volUp(): void;
  volDown(): void;
  play(track: any, folder?: any): void;
  stop(): void;
  pause(): void;
  resume(): void;
}
