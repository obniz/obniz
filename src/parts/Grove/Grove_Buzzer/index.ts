import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";

export interface Grove_BuzzerOptions { }
class Grove_Buzzer implements ObnizPartsInterface {

  public static info() {
    return {
      name: "Grove_Buzzer",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public obniz!: Obniz;
  public params: any;
  public pwm: any;

  constructor(obniz: any) {
    this.keys = ["signal", "gnd", "vcc"];
    this.requiredKeys = ["signal"];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.pwm = obniz.getFreePwm();
    this.pwm.start({io: this.params.signal});
  }

  public play(freq: any) {
    if (typeof freq !== "number") {
      throw new Error("freq must be a number");
    }
    freq = Math.floor(freq);
    if (freq > 0) {
      this.pwm.freq(freq);
      this.pwm.pulse((1 / freq / 2) * 1000);
    } else {
      this.pwm.pulse(0);
    }
  }

  public stop() {
    this.play(0);
  }
}

export default Grove_Buzzer;
