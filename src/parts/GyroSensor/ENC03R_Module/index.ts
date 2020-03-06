/**
 * @packageDocumentation
 * @module Parts.ENC03R_Module
 */

import Obniz from "../../../obniz";
import PeripheralAD from "../../../obniz/libs/io_peripherals/ad";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface ENC03R_ModuleOptions {
  gnd?: number;
  vcc?: number;
  out2: number;
  out1: number;
}

export default class ENC03R_Module implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "ENC03R_Module",
    };
  }

  public keys: string[];
  public requiredKeys: any;
  public params: any;

  public Sens = 0.00067; // Sensitivity, 0.67mV / deg/sec
  public sens1: number = 0;
  public onchange1?: (val: number) => void;
  public sens2: number = 0;
  public onchange2?: (val: number) => void;

  protected obniz!: Obniz;

  private ad0!: PeripheralAD;
  private ad1!: PeripheralAD;

  constructor() {
    this.keys = ["vcc", "out1", "out2", "gnd"];
    this.requiredKeys = ["out1", "out2"];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.ad0 = obniz.getAD(this.params.out1);
    this.ad1 = obniz.getAD(this.params.out2);

    this.ad0.start((value: number) => {
      this.sens1 = (value - 1.45) / this.Sens; // [Angular velocity(deg/sec)] = ( [AD Voltage]-1.35V ) / 0.67mV
      if (this.onchange1) {
        this.onchange1(this.sens1);
      }
    });

    this.ad1.start((value: number) => {
      this.sens2 = (value - 1.35) / this.Sens; // [Angular velocity(deg/sec)] = ( [AD Voltage]-1.35V ) / 0.67mV
      if (this.onchange2) {
        this.onchange2(this.sens2);
      }
    });
  }

  public get1Wait(): Promise<number> {
    return new Promise(async (resolve) => {
      const value: number = await this.ad0.getWait();
      this.sens1 = (value - 1.45) / this.Sens;
      resolve(this.sens1);
    });
  }

  public get2Wait(): Promise<number> {
    return new Promise(async (resolve) => {
      const value: number = await this.ad1.getWait();
      this.sens2 = (value - 1.35) / this.Sens;
      resolve(this.sens2);
    });
  }
}
