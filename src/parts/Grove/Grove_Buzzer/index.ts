class Grove_Buzzer {

  public static info() {
    return {
      name: "Grove_Buzzer",
    };
  }

  public keys: any;
  public requiredKeys: any;
  public obniz: any;
  public params: any;
  public pwm: any;

  constructor(obniz: any) {
    this.keys = ["signal", "gnd", "vcc"];
    this.requiredKeys = ["signal"];
  }

  public wired(obniz: any) {
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

if (typeof module === "object") {
  module.exports = Grove_Buzzer;
}
