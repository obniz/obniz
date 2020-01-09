class WS2811 {

  public static info() {
    return {
      name: "WS2811",
    };
  }

  public static _generateFromByte(val: any) {
    // T0H 0.5us+-0.15us
    // T1H 1.2us+-0.15us
    // T0L 2.0us+-0.15us
    // T1L 1.3us+-0.15us

    val = parseInt(val);
    const zero: any = 0x8;
    const one: any = 0xe;
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

  public static _generateColor(r: any, g: any, b: any) {
    let array: any = WS2811._generateFromByte(r);
    array = array.concat(WS2811._generateFromByte(g));
    array = array.concat(WS2811._generateFromByte(b));
    return array;
  }

  public static _generateHsvColor(h: any, s: any, v: any) {
    const C: any = v * s;
    const Hp: any = h / 60;
    const X: any = C * (1 - Math.abs((Hp % 2) - 1));

    let R: any; let G: any; let B: any;
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

    let array: any = WS2811._generateFromByte(R);
    array = array.concat(WS2811._generateFromByte(G));
    array = array.concat(WS2811._generateFromByte(B));
    return array;
  }

  public keys: any;
  public requiredKeys: any;
  public obniz: any;
  public params: any;
  public spi: any;

  constructor() {
    this.keys = ["din", "vcc", "gnd"];
    this.requiredKeys = ["din"];
  }

  public wired(obniz: any) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    this.params.mode = "master";
    this.params.frequency = 2 * 1000 * 1000;
    this.params.mosi = this.params.din;
    this.params.drive = "5v"; // It over spec for frequency. But VIN-HI require 0.7VCC<=.
    this.spi = this.obniz.getSpiWithConfig(this.params);
  }

  public rgb(r: any, g: any, b: any) {
    this.spi.write(WS2811._generateColor(r, g, b));
  }

  public hsv(h: any, s: any, v: any) {
    this.spi.write(WS2811._generateHsvColor(h, s, v));
  }

  public rgbs(array: any) {
    let bytes: any = [];
    for (let i = 0; i < array.length; i++) {
      const oneArray: any = array[i];
      bytes = bytes.concat(
        WS2811._generateColor(oneArray[0], oneArray[1], oneArray[2]),
      );
    }
    this.spi.write(bytes);
  }

  public hsvs(array: any) {
    let bytes: any = [];
    for (let i = 0; i < array.length; i++) {
      const oneArray: any = array[i];
      bytes = bytes.concat(
        WS2811._generateHsvColor(oneArray[0], oneArray[1], oneArray[2]),
      );
    }
    this.spi.write(bytes);
  }
}

export default WS2811;
