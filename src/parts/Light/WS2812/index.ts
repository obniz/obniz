/**
 * @packageDocumentation
 * @module Parts.WS2812
 */

import Obniz from "../../../obniz";
import PeripheralSPI from "../../../obniz/libs/io_peripherals/spi";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface WS2812Options {
  din: number;
  vcc?: number;
  gnd?: number;
}

export default class WS2812 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "WS2812",
    };
  }

  private static _generateFromByte(val: any) {
    // T0H 0.35us+-0.15us
    // T1H 0.7us+-0.15us
    // T0L 0.8us+-0.15us
    // T1L 0.6us+-0.15us

    // 0.3-0.9 and 0.6-0.6 at 3.33Mhz

    val = parseInt(val);
    const zero: any = 0x8;
    const one: any = 0xc;
    const ret: any = [];
    for (let i = 0; i < 8; i += 2) {
      let byte: any = 0;
      if (val & (0x80 >> i)) {
        byte = one << 4;
      } else {
        byte = zero << 4;
      }
      if (val & (0x80 >> (i + 1))) {
        byte |= one;
      } else {
        byte |= zero;
      }
      ret.push(byte);
    }
    return ret;
  }

  private static _generateColor(r: any, g: any, b: any) {
    let array: any = WS2812._generateFromByte(g);
    array = array.concat(WS2812._generateFromByte(r));
    array = array.concat(WS2812._generateFromByte(b));
    return array;
  }

  private static _generateHsvColor(h: any, s: any, v: any) {
    const C: any = v * s;
    const Hp: any = h / 60;
    const X: any = C * (1 - Math.abs((Hp % 2) - 1));

    let R: any;
    let G: any;
    let B: any;
    if (0 <= Hp && Hp < 1) {
      [R, G, B] = [C, X, 0];
    }
    if (1 <= Hp && Hp < 2) {
      [R, G, B] = [X, C, 0];
    }
    if (2 <= Hp && Hp < 3) {
      [R, G, B] = [0, C, X];
    }
    if (3 <= Hp && Hp < 4) {
      [R, G, B] = [0, X, C];
    }
    if (4 <= Hp && Hp < 5) {
      [R, G, B] = [X, 0, C];
    }
    if (5 <= Hp && Hp < 6) {
      [R, G, B] = [C, 0, X];
    }

    const m: any = v - C;
    [R, G, B] = [R + m, G + m, B + m];

    R = Math.floor(R * 255);
    G = Math.floor(G * 255);
    B = Math.floor(B * 255);

    return WS2812._generateColor(R, G, B);
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  protected obniz!: Obniz;

  private spi!: PeripheralSPI;

  constructor() {
    this.keys = ["din", "vcc", "gnd"];
    this.requiredKeys = ["din"];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    this.params.mode = "master";
    this.params.frequency = Math.floor(3.33 * 1000 * 1000);
    this.params.mosi = this.params.din;
    this.params.drive = "5v"; // It over spec for frequency. But VIN-HI require 0.7VCC<=.
    this.spi = this.obniz.getSpiWithConfig(this.params);
  }

  public rgb(red: number, green: number, blue: number) {
    this.spi.write(WS2812._generateColor(red, green, blue));
  }

  public hsv(hue: number, saturation: number, value: number) {
    this.spi.write(WS2812._generateHsvColor(hue, saturation, value));
  }

  public rgbs(array: Array<[number, number, number]>) {
    let bytes: any = [];
    for (let i = 0; i < array.length; i++) {
      const oneArray: any = array[i];
      bytes = bytes.concat(WS2812._generateColor(oneArray[0], oneArray[1], oneArray[2]));
    }
    this.spi.write(bytes);
  }

  public hsvs(array: Array<[number, number, number]>) {
    let bytes: any = [];
    for (let i = 0; i < array.length; i++) {
      const oneArray: any = array[i];
      bytes = bytes.concat(WS2812._generateHsvColor(oneArray[0], oneArray[1], oneArray[2]));
    }
    this.spi.write(bytes);
  }
}
