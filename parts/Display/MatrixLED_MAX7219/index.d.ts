export interface MatrixLED_MAX7219Options {
  clk: number;
  cs: number;
  din: number;
  gnd?: number;
  vcc?: number;
}

export interface MatrixLED_MAX7219 {
  init(width: number, height: number): void;
  brightness(value: number): void;
  draw(ctx: HTMLCanvasElement): void;
  clear(): void;
  test(): void;
}
