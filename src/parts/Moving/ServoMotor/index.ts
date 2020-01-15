import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";

export interface ServoMotorOptions { }
class ServoMotor implements ObnizPartsInterface {

  public static info() {
    return {
      name: "ServoMotor",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public range: any;
  public obniz!: Obniz;
  public params: any;
  public io_vcc: any;
  public pwm: any;
  public pwm_io_num: any;

  constructor() {
    this.keys = ["gnd", "vcc", "signal", "pwm"];
    this.requiredKeys = [];

    this.range = {
      min: 0.5,
      max: 2.4,
    };
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    if (obniz.isValidIO(this.params.vcc)) {
      this.io_vcc = obniz.getIO(this.params.vcc);
    }

    if (this.params.pwm) {
      this.pwm = this.params.pwm;
    } else {
      this.pwm = obniz.getFreePwm();
      this.pwm_io_num = this.params.signal;
      this.pwm.start({io: this.pwm_io_num});
    }
    this.pwm.freq(50);
  }

  // Module functions

  public angle(ratio: any) {
    const max: any = this.range.max;
    const min: any = this.range.min;
    const val: any = ((max - min) * ratio) / 180.0 + min;
    this.pwm.pulse(val);
  }

  public on() {
    if (this.io_vcc) {
      this.io_vcc.output(true);
    }
  }

  public off() {
    if (this.io_vcc) {
      this.io_vcc.output(false);
    }
  }
}

export default ServoMotor;
