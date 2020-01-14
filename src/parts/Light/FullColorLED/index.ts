import {createSocket} from "dgram";

class FullColorLED {

  public static info() {
    return {
      name: "FullColorLED",
    };
  }

  public COMMON_TYPE_ANODE: any;
  public COMMON_TYPE_CATHODE: any;
  public anode_keys: any;
  public cathode_keys: any;
  public animationName: any;
  public keys: any;
  public requiredKeys: any;
  public params: any;
  public obniz: any;
  public commontype: any;
  public common: any;
  public pwmR: any;
  public pwmG: any;
  public pwmB: any;

  constructor() {
    this.COMMON_TYPE_ANODE = 1;
    this.COMMON_TYPE_CATHODE = 0;

    this.anode_keys = ["anode", "anode_common", "anodeCommon", "vcc"];
    this.cathode_keys = ["cathode", "cathode_common", "cathodeCommon", "gnd"];
    this.animationName = "FullColorLED-" + Math.round(Math.random() * 1000);

    this.keys = ["r", "g", "b", "common", "commonType"];
    this.requiredKeys = ["r", "g", "b", "common", "commonType"];
  }

  public wired(obniz: any) {
    const r: any = this.params.r;
    const g: any = this.params.g;
    const b: any = this.params.b;
    const common: any = this.params.common;
    const commontype: any = this.params.commonType;

    this.obniz = obniz;
    if (this.anode_keys.includes(commontype)) {
      this.commontype = this.COMMON_TYPE_ANODE;
    } else if (this.cathode_keys.includes(commontype)) {
      this.commontype = this.COMMON_TYPE_CATHODE;
    } else {
      this.obniz.error(
        "FullColorLED param need common type [  anode_common or cathode_common ] ",
      );
    }

    this.common = this.obniz.getIO(common);
    this.common.output(this.commontype);

    this.obniz.getIO(r).output(this.commontype);
    this.obniz.getIO(g).output(this.commontype);
    this.obniz.getIO(b).output(this.commontype);
    this.pwmR = this.obniz.getFreePwm();
    this.pwmR.start({io: r});
    this.pwmR.freq(1000);
    this.pwmG = this.obniz.getFreePwm();
    this.pwmG.start({io: g});
    this.pwmG.freq(1000);
    this.pwmB = this.obniz.getFreePwm();
    this.pwmB.start({io: b});
    this.pwmB.freq(1000);
    this.rgb(0, 0, 0);
  }

  public rgb(r: any, g: any, b: any) {
    r = Math.min(Math.max(parseInt(r), 0), 255);
    g = Math.min(Math.max(parseInt(g), 0), 255);
    b = Math.min(Math.max(parseInt(b), 0), 255);

    if (this.commontype === this.COMMON_TYPE_ANODE) {
      r = 255 - r;
      g = 255 - g;
      b = 255 - b;
    }
    this.pwmR.duty((r / 255) * 100);
    this.pwmG.duty((g / 255) * 100);
    this.pwmB.duty((b / 255) * 100);
  }

  public hsv(h: any, s: any, v: any) {
    const C: any = v * s;
    const Hp: any = h / 60;
    const X: any = C * (1 - Math.abs((Hp % 2) - 1));

    let R: any; let  G: any; let B: any;
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

    this.rgb(R, G, B);
  }

  public gradation(cycletime_ms: any) {
    const frames: any = [];
    const max: any = 36 / 2;
    const duration: any = Math.round(cycletime_ms / max);
    for (let i = 0; i < max; i++) {
      const oneFrame: any = {
        duration,
        state: (index: any) => {
          // index = 0
          this.hsv(index * 10 * 2, 1, 1);
        },
      };
      frames.push(oneFrame);
    }
    this.obniz.io.animation(this.animationName, "loop", frames);
  }

  public stopgradation() {
    this.obniz.io.animation(this.animationName, "pause");
  }
}

export default FullColorLED;