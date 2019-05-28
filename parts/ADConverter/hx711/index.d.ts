export interface HX711Options {
  vcc?: number;
  gnd?: number;
  sck: number;
  dout: number;
}

export interface HX711 {
  offset: number;
  scale: number;
  getValueWait(times?: number): Promise<number>;
  zeroAdjust(times?: number): void;
  powerDown(): void;
  powerUp(): void;
}
