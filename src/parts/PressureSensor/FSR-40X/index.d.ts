export interface FSR40XOptions {
  pin0: number;
  pin1: number;
}

export interface FSR40X {
  onchange: (temp: number) => void;
  getWait(): Promise<number>;
}
