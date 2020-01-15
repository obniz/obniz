import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";

export interface HCSR505Options { }
class HCSR505 implements ObnizPartsInterface {

  public static info() {
    return {
      name: "HC-SR505",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public obniz!: Obniz;
  public io_signal: any;
  public params: any;
  public onchange: any;

  constructor() {
    this.keys = ["vcc", "gnd", "signal"];
    this.requiredKeys = ["signal"];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    this.io_signal = obniz.getIO(this.params.signal);

    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    this.io_signal.input((value: any) => {
      if (this.onchange) {
        this.onchange(value);
      }
    });
  }

  public getWait() {
    return this.io_signal.inputWait();
  }
}

export default HCSR505;
