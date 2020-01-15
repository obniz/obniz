import Obniz from "../../../obniz";
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";

export interface ENC03R_ModuleOptions { }
class ENC03R_Module implements ObnizPartsInterface {

  public static info(): ObnizPartsInfo {
    return {
      name: "ENC03R_Module",
    };
  }

  public keys: string[];
  public requiredKeys: any;
  public Sens: any;
  public obniz!: Obniz;
  public params: any;
  public ad0: any;
  public ad1: any;
  public sens1: any;
  public onchange1: any;
  public sens2: any;
  public onchange2: any;

  constructor() {
    this.keys = ["vcc", "out1", "out2", "gnd"];
    this.requiredKeys = ["out1", "out2"];
    this.Sens = 0.00067; // Sensitivity, 0.67mV / deg/sec
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.ad0 = obniz.getAD(this.params.out1);
    this.ad1 = obniz.getAD(this.params.out2);

    this.ad0.start((value: any) => {
      this.sens1 = (value - 1.45) / this.Sens; // [Angular velocity(deg/sec)] = ( [AD Voltage]-1.35V ) / 0.67mV
      if (this.onchange1) {
        this.onchange1(this.sens1);
      }
    });

    this.ad1.start((value: any) => {
      this.sens2 = (value - 1.35) / this.Sens; // [Angular velocity(deg/sec)] = ( [AD Voltage]-1.35V ) / 0.67mV
      if (this.onchange2) {
        this.onchange2(this.sens2);
      }
    });
  }

  public get1Wait() {
    return new Promise(async (resolve) => {
      const value: any = this.ad0.getWait();
      this.sens1 = (value - 1.45) / this.Sens;
      resolve(this.sens1);
    });
  }

  public get2Wait() {
    return new Promise(async (resolve) => {
      const value: any = this.ad1.getWait();
      this.sens2 = (value - 1.35) / this.Sens;
      resolve(this.sens2);
    });
  }
}

export default ENC03R_Module;
