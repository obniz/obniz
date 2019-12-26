export interface SainSmartTFT18LCDOptions {
  scl: number;
  sda: number;
  dc: number;
  res: number;
  cs: number;
  vcc?: number;
  gnd?: number;
}

export type RGB16 = number;
export type RGB24 = number;
export interface PresetColor {
  AliceBlue: RGB16;
  AntiqueWhite: RGB16;
  Aqua: RGB16;
  Aquamarine: RGB16;
  Azure: RGB16;
  Beige: RGB16;
  Bisque: RGB16;
  Black: RGB16;
  BlanchedAlmond: RGB16;
  Blue: RGB16;
  BlueViolet: RGB16;
  Brown: RGB16;
  BurlyWood: RGB16;
  CadetBlue: RGB16;
  Chartreuse: RGB16;
  Chocolate: RGB16;
  Coral: RGB16;
  CornflowerBlue: RGB16;
  Cornsilk: RGB16;
  Crimson: RGB16;
  Cyan: RGB16;
  DarkBlue: RGB16;
  DarkCyan: RGB16;
  DarkGoldenRod: RGB16;
  DarkGray: RGB16;
  DarkGreen: RGB16;
  DarkKhaki: RGB16;
  DarkMagenta: RGB16;
  DarkOliveGreen: RGB16;
  DarkOrange: RGB16;
  DarkOrchid: RGB16;
  DarkRed: RGB16;
  DarkSalmon: RGB16;
  DarkSeaGreen: RGB16;
  DarkSlateBlue: RGB16;
  DarkSlateGray: RGB16;
  DarkTurquoise: RGB16;
  DarkViolet: RGB16;
  DeepPink: RGB16;
  DeepSkyBlue: RGB16;
  DimGray: RGB16;
  DodgerBlue: RGB16;
  FireBrick: RGB16;
  FloralWhite: RGB16;
  ForestGreen: RGB16;
  Fuchsia: RGB16;
  Gainsboro: RGB16;
  GhostWhite: RGB16;
  Gold: RGB16;
  GoldenRod: RGB16;
  Gray: RGB16;
  Green: RGB16;
  GreenYellow: RGB16;
  HoneyDew: RGB16;
  HotPink: RGB16;
  IndianRed: RGB16;
  Indigo: RGB16;
  Ivory: RGB16;
  Khaki: RGB16;
  Lavender: RGB16;
  LavenderBlush: RGB16;
  LawnGreen: RGB16;
  LemonChiffon: RGB16;
  LightBlue: RGB16;
  LightCoral: RGB16;
  LightCyan: RGB16;
  LightGoldenRodYellow: RGB16;
  LightGray: RGB16;
  LightGreen: RGB16;
  LightPink: RGB16;
  LightSalmon: RGB16;
  LightSeaGreen: RGB16;
  LightSkyBlue: RGB16;
  LightSlateGray: RGB16;
  LightSteelBlue: RGB16;
  LightYellow: RGB16;
  Lime: RGB16;
  LimeGreen: RGB16;
  Linen: RGB16;
  Magenta: RGB16;
  Maroon: RGB16;
  MediumAquaMarine: RGB16;
  MediumBlue: RGB16;
  MediumOrchid: RGB16;
  MediumPurple: RGB16;
  MediumSeaGreen: RGB16;
  MediumSlateBlue: RGB16;
  MediumSpringGreen: RGB16;
  MediumTurquoise: RGB16;
  MediumVioletRed: RGB16;
  MidnightBlue: RGB16;
  MintCream: RGB16;
  MistyRose: RGB16;
  Moccasin: RGB16;
  NavajoWhite: RGB16;
  Navy: RGB16;
  OldLace: RGB16;
  Olive: RGB16;
  OliveDrab: RGB16;
  Orange: RGB16;
  OrangeRed: RGB16;
  Orchid: RGB16;
  PaleGoldenRod: RGB16;
  PaleGreen: RGB16;
  PaleTurquoise: RGB16;
  PaleVioletRed: RGB16;
  PapayaWhip: RGB16;
  PeachPuff: RGB16;
  Peru: RGB16;
  Pink: RGB16;
  Plum: RGB16;
  PowderBlue: RGB16;
  Purple: RGB16;
  RebeccaPurple: RGB16;
  Red: RGB16;
  RosyBrown: RGB16;
  RoyalBlue: RGB16;
  SaddleBrown: RGB16;
  Salmon: RGB16;
  SandyBrown: RGB16;
  SeaGreen: RGB16;
  SeaShell: RGB16;
  Sienna: RGB16;
  Silver: RGB16;
  SkyBlue: RGB16;
  SlateBlue: RGB16;
  SlateGray: RGB16;
  Snow: RGB16;
  SpringGreen: RGB16;
  SteelBlue: RGB16;
  Tan: RGB16;
  Teal: RGB16;
  Thistle: RGB16;
  Tomato: RGB16;
  Turquoise: RGB16;
  Violet: RGB16;
  Wheat: RGB16;
  White: RGB16;
  WhiteSmoke: RGB16;
  Yellow: RGB16;
  YellowGreen: RGB16;
}

export interface SainSmartTFT18LCD {
  readonly width: number;
  readonly height: number;
  readonly color: PresetColor;
  color16(r: number, g: number, b: number): RGB16;
  fillScreen(color: RGB16): void;
  drawRect(x: number, y: number, width: number, height: number, color: RGB16): void;
  fillRect(x: number, y: number, width: number, height: number, color: RGB16): void;
  drawRoundRect(x: number, y: number, width: number, height: number, round: number, color: RGB16): void;
  fillRoundRect(x: number, y: number, width: number, height: number, round: number, color: RGB16): void;
  drawCircle(x: number, y: number, radius: number, color: RGB16): void;
  fillCircle(x: number, y: number, radius: number, color: RGB16): void;
  drawTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, color: RGB16): void;
  fillTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, color: RGB16): void;
  drawVLine(x: number, y: number, height: number, color: RGB16): void;
  drawHLine(x: number, y: number, width: number, color: RGB16): void;
  drawLine(x0: number, y0: number, x1: number, y1: number, color: RGB16): void;
  drawChar(x: number, y: number, char: string, color: RGB16, backgroundColor: RGB16, size?: number): void;
  drawString(
    x: number,
    y: number,
    string: string,
    color: RGB16,
    backgroundColor: RGB16,
    size?: number,
    wrap?: boolean
  ): [number, number];
  drawContextBound(
    context: any,
    x0: number,
    y0: number,
    width: number,
    height: number,
    x1: number,
    y1: number,
    gray: boolean
  ): void;
  drawContext(context: CanvasRenderingContext2D, gray: boolean): void;
  setRotation(dir: number): void;
  setInversionOn(): void;
  setInversionOff(): void;
  setInversion(inversion: boolean): void;
  rawBound(x: number, y: number, width: number, height: number, pixels: RGB24[]): void;
  raw(pixels: RGB24[]): void;
}
