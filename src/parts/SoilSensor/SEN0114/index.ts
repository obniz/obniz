import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";

export interface SEN0114Options { }
class SEN0114 implements ObnizPartsInterface {

  public static info() {
    return {
      name: "SEN0114",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public obniz!: Obniz;
  public params: any;
  public ad: any;
  public value: any;
  public onchange: any;

  constructor() {
    this.keys = ["vcc", "output", "gnd"];
    this.requiredKeys = ["output"];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.ad = obniz.getAD(this.params.output);

    this.ad.start((value: any) => {
      this.value = value;
      if (this.onchange) {
        this.onchange(this.value);
      }
    });
  }

  public async getHumidityWait() {
    this.value = await this.ad.getWait();
    return this.value;
  }
}

export default SEN0114;
