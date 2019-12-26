export interface InfraredLEDOptions {
  anode: number;
  cathode?: number;
}

export interface InfraredLED {
  dataSymbolLength: number;
  send(array: number[]): void;
}
