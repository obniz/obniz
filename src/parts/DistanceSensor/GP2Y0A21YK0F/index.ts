import Obniz from "../../../obniz";
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";

export interface GP2Y0A21YK0FOptions { }
class GP2Y0A21YK0F implements ObnizPartsInterface {

  public static info(): ObnizPartsInfo {
    return {
      name: "GP2Y0A21YK0F",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public displayIoNames: any;
  public _unit: any;
  public obniz!: Obniz;
  public params: any;
  public io_signal: any;
  public ad_signal: any;

  constructor() {
    this.keys = ["vcc", "gnd", "signal"];
    this.requiredKeys = ["signal"];

    this.displayIoNames = {
      vcc: "vcc",
      gnd: "gnd",
      signal: "signal",
    };
    this._unit = "mm";
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.io_signal = obniz.getIO(this.params.signal);
    this.io_signal.end();
    this.ad_signal = obniz.getAD(this.params.signal);
  }

  public start(callback: any) {
    this.ad_signal.start((val: any) => {
      const distance: any = this._volt2distance(val);
      if (typeof callback === "function") {
        callback(distance);
      }
    });
  }

  public _volt2distance(val: any) {
    if (val <= 0) {
      val = 0.001;
    }
    let distance: any = 19988.34 * Math.pow((val / 5.0) * 1024, -1.25214) * 10;
    if (this._unit === "mm") {
      distance = Math.floor(distance * 10) / 10;
    } else {
      distance *= 0.0393701;
      distance = Math.floor(distance * 1000) / 1000;
    }
    return distance;
  }

  public getWait() {
    return new Promise(async (resolve) => {
      const val: any = await this.ad_signal.getWait();
      const distance: any = this._volt2distance(val);
      resolve(distance);
    });
  }

  public unit(unit: any) {
    if (unit === "mm") {
      this._unit = "mm";
    } else if (unit === "inch") {
      this._unit = "inch";
    } else {
      throw new Error("unknown unit " + unit);
    }
  }
}

export default GP2Y0A21YK0F;
