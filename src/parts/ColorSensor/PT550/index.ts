import Obniz from "../../../obniz";
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";

export interface PT550Options { }
class PT550 implements ObnizPartsInterface {

  public static info(): ObnizPartsInfo {
    return {
      name: "PT550",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public obniz!: Obniz;
  public params: any;
  public signal: any;
  public onchange: any;

  constructor() {
    this.keys = ["signal", "vcc", "gnd"];
    this.requiredKeys = ["signal"];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.signal = this.obniz.getAD(this.params.signal);
    this.signal.start((value: any) => {
      if (this.onchange) {
        this.onchange(value);
      }
    });
  }

  public async getWait() {
    return await this.signal.getWait();
  }
}

export default PT550;
