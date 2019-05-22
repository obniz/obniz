export interface JoyStickOptions {
  sw: number;
  x: number;
  y: number;
  vcc?: number;
  gnd?: number;
  i2c?: any;
}

export interface JoyStick {
  onchangex: (val: number) => void;
  onchangey: (val: number) => void;
  onchangesw: (pressed: boolean) => void;
  isPressedWait(): Promise<boolean>;
  getXWait(): Promise<number>;
  getYWait(): Promise<number>;
}
