import Obniz from "../../../obniz";
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";

export interface YG1006Options { }
class YG1006 implements ObnizPartsInterface {

  public static info(): ObnizPartsInfo {
    return {
      name: "YG1006",
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
    const value: any = await this.signal.getWait();
    return value;
  }
}

export default YG1006;
