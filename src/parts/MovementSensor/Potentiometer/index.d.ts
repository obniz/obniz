export interface PotentiometerOptions {
  pin0: number;
  pin1: number;
  pin2: number;
}

export interface Potentiometer {
  onchange: (position: number) => void;
}
