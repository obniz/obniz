import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";

export interface InfraredLEDOptions { }
class InfraredLED implements ObnizPartsInterface {

  public static info() {
    return {
      name: "InfraredLED",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public dataSymbolLength: any;
  public obniz!: Obniz;
  public params: any;
  public io_cathode: any;
  public pwm: any;

  constructor() {
    this.keys = ["anode", "cathode"];
    this.requiredKeys = ["anode"];

    this.dataSymbolLength = 0.07;
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    if (!this.obniz.isValidIO(this.params.anode)) {
      throw new Error("anode is not valid io");
    }
    if (this.params.cathode) {
      if (!this.obniz.isValidIO(this.params.cathode)) {
        throw new Error("cathode is not valid io");
      }
      this.io_cathode = obniz.getIO(this.params.cathode);
      this.io_cathode.output(false);
    }
    this.pwm = this.obniz.getFreePwm();
    this.pwm.start({io: this.params.anode});
    this.pwm.freq(38000);
    this.obniz.wait(150); // TODO: this is instant fix for pwm start delay
  }

  public send(arr: any) {
    if (arr && arr.length > 0 && arr[arr.length - 1] === 1) {
      arr.push(0);
    }
    this.pwm.modulate("am", this.dataSymbolLength, arr);
  }
}

export default InfraredLED;
