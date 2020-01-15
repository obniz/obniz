import Obniz from "../../../obniz";
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";

export interface PaPIRsVZOptions { }
class PaPIRsVZ implements ObnizPartsInterface {

  public static info(): ObnizPartsInfo {
    return {
      name: "PaPIRsVZ",
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
    this.io_signal.pull("0v");

    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    this.io_signal.input((value: any) => {
      if (this.onchange) {
        this.onchange(value);
      }
    });
  }
}

export default PaPIRsVZ;
