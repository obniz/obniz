export type CorrectionType = 'L' | 'M' | 'Q' | 'H';
export interface Display {
  clear(): void;
  print(string: string): void;
  pos(x: number, y: number): void;
  font(fontFamilyName: string, fontSize?: number): void;
  line(start_x: number, start_y: number, end_x: number, end_y: number): void;
  rect(x: number, y: number, width: number, height: number, fill?: boolean): void;
  circle(x: number, y: number, radius: number, fill?: boolean): void;
  drawing(mode: boolean): void;
  qr(data: string, correction?: CorrectionType): void;
  raw(bits: number[]): void;
  draw(context: HTMLCanvasElement): void;
}