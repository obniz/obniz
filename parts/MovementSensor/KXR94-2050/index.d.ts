export interface KXR94_2050Options {
  x: number;
  y: number;
  z: number;
  vcc?: number;
  gnd?: number;
  enable?: number;
  self_test?: number;
}

export interface KXR94_2050 {
  onChange: (value: { x: number; y: number; z: number }) => void;
  onChangeX: (x: number) => void;
  onChangeY: (y: number) => void;
  onChangeZ: (z: number) => void;
  get(): { x: number; y: number; z: number };
  getWait(): Promise<{ x: number; y: number; z: number }>;
}
